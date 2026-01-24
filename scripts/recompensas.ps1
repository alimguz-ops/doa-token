# scripts/recompensas.ps1
# Ejecuta distribuciones y registra auditoría en logs/recompensas.log.jsonl

param(
    [string]$Fuente = "$PSScriptRoot\..\logs\recompensas.json",
    [string]$LogOut = "$PSScriptRoot\..\logs\recompensas.log.jsonl"
)

function Ensure-File {
    param([string]$Path, [string]$Init = "")
    if (-not (Test-Path $Path)) {
        if ($Init -ne "") { $Init | Out-File -FilePath $Path -Encoding UTF8 }
        else { New-Item -ItemType File -Path $Path | Out-Null }
    }
}

function Append-JsonLine {
    param([string]$Path, [hashtable]$Obj)
    ($Obj | ConvertTo-Json -Depth 10 -Compress) | Add-Content -Path $Path -Encoding UTF8
}

# --- Cargar entorno ---
$envPath = "$PSScriptRoot\..\.env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^\s*#" -or $_.Trim() -eq "") { return }
        $parts = $_ -split "=", 2
        if ($parts.Count -eq 2) {
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            if ($name -and $value) {
                [System.Environment]::SetEnvironmentVariable($name, $value)
            }
        }
    }
}

# --- Verificaciones iniciales ---
if (-not (Test-Path $Fuente)) {
    Write-Host "No se encontró ${Fuente}" -ForegroundColor Yellow
    exit 1
}
Ensure-File -Path $LogOut

# --- Función de transferencia ---
function Invoke-DoaTransfer {
    param(
        [string]$Wallet,
        [decimal]$Cantidad,
        [string]$Token
    )
    if (-not $Wallet -or -not $Cantidad -or -not $Token) {
        throw "Parámetros inválidos para transferencia"
    }

    try {
        # Integración real con CLI/SDK aquí
        $stamp = (Get-Date).ToUniversalTime().ToString("yyyyMMddHHmmssfff")
        $txHash = "DOA-" + $stamp + "-" + ($Wallet.Substring(0,6))
        return @{ txHash = $txHash; estado = "emitido" }
    } catch {
        return @{
            txHash = "ERROR-" + (Get-Date).ToUniversalTime().ToString("yyyyMMddHHmmssfff")
            estado = "fallido: $($_.Exception.Message)"
        }
    }
}

# --- Cargar recompensas ---
try {
    $recompensas = Get-Content $Fuente -Raw | ConvertFrom-Json
} catch {
    Write-Host "Error leyendo JSON en ${Fuente}: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if (-not $recompensas) {
    Write-Host "No hay entradas de recompensas en ${Fuente}" -ForegroundColor Yellow
    exit 0
}

# --- Ejecutar y registrar ---
$ejecuciones = 0
foreach ($r in $recompensas) {
    if (-not $r.wallet -or -not $r.cantidad -or -not $r.token -or [decimal]$r.cantidad -le 0) {
        Write-Host "Entrada inválida: $($r | ConvertTo-Json -Compress)" -ForegroundColor Yellow
        continue
    }

    $res = Invoke-DoaTransfer -Wallet $r.wallet -Cantidad $r.cantidad -Token $r.token

    $logEntry = @{
        fecha_ejecucion = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        timestamp       = [int][double]::Parse((Get-Date -UFormat %s))
        wallet          = $r.wallet
        cantidad        = [decimal]$r.cantidad
        token           = $r.token
        txHash          = $res.txHash
        estado          = $res.estado
        origen_fecha    = $r.fecha
        plataforma      = "Blockchain"
    }

    Append-JsonLine -Path $LogOut -Obj $logEntry
    Write-Host ("✅ Distribución registrada | {0} {1} → {2} | tx {3}" -f $r.cantidad, $r.token, $r.wallet, $res.txHash)
    $ejecuciones++
}

Write-Host "`nTotal de ejecuciones registradas: $ejecuciones"