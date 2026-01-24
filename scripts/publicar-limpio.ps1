param(
    [string]$JsonPath = "$PSScriptRoot\..\automation\calendario.json",
    [string]$LogOut   = "$PSScriptRoot\..\logs\publicaciones.jsonl"
)

# --- RUTA FIJA A LA RAÍZ DEL PROYECTO ---
$ProjectRoot = (Split-Path $PSScriptRoot -Parent)  # D:\doa-token
$envPath = Join-Path $ProjectRoot ".env"
if (-not (Test-Path $envPath)) {
    throw "❌ No se encontró .env en $ProjectRoot"
}

# --- CARGAR .env (solo proceso actual) ---
Get-Content $envPath | ForEach-Object {
    if ($_ -match "^\s*#" -or $_.Trim() -eq "") { return }
    $parts = $_ -split "=", 2
    if ($parts.Count -eq 2) {
        $key = $parts[0].Trim()
        $val = $parts[1].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
    }
}

# --- Credenciales ---
$twitterBearer = $env:TWITTER_BEARER_TOKEN
$telegramToken = $env:TELEGRAM_BOT_TOKEN
$telegramChat  = $env:TELEGRAM_CHAT_ID
$discordHook   = $env:DISCORD_WEBHOOK_URL

# --- Validar calendario ---
if (-not (Test-Path $JsonPath)) {
    throw "❌ No se encontró el archivo de calendario en ${JsonPath}"
}
try {
    $tareas = Get-Content $JsonPath -Raw | ConvertFrom-Json
} catch {
    throw "❌ Error al cargar o parsear ${JsonPath}: $($_.Exception.Message)"
}

# --- Validar archivo de log ---
if (-not (Test-Path $LogOut)) {
    New-Item -ItemType File -Force -Path $LogOut | Out-Null
}

# --- Funciones de publicación ---
function Publicar-Twitter($mensaje) {
    if (-not $twitterBearer) { throw "Falta TWITTER_BEARER_TOKEN en .env" }
    $url = "https://api.twitter.com/2/tweets"
    $headers = @{ Authorization = "Bearer $twitterBearer" }
    $body = @{ text = $mensaje } | ConvertTo-Json
    try {
        $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "[Twitter] Publicado | ID: $($res.data.id)"
        return $res.data.id
    } catch {
        Write-Host "⛔ Error Twitter: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Publicar-Telegram($mensaje) {
    if (-not $telegramToken -or -not $telegramChat) { throw "Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en .env" }
    $url = "https://api.telegram.org/bot$telegramToken/sendMessage"
    try {
        $res = Invoke-RestMethod -Uri $url -Method Post -Body @{ chat_id = $telegramChat; text = $mensaje }
        Write-Host "[Telegram] Publicado | ID: $($res.result.message_id)"
        return $res.result.message_id
    } catch {
        Write-Host "⛔ Error Telegram: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Publicar-Discord($mensaje) {
    if (-not $discordHook) { throw "Falta DISCORD_WEBHOOK_URL en .env" }
    $body = @{ content = $mensaje } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri $discordHook -Method Post -Body $body -ContentType "application/json"
        Write-Host "[Discord] Publicado"
        return "OK"
    } catch {
        Write-Host "⛔ Error Discord: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# --- Función de recompensas real ---
function Distribuir-Recompensas($dia, $categoria, $mensaje) {
    try {
        $res = & "$PSScriptRoot\recompensas.ps1"
        if ($res -is [PSCustomObject] -and $res.txHash) {
            Write-Host "[Recompensas] Día $dia | Categoría: $categoria | txHash: $($res.txHash)"
            return $res.txHash
        } else {
            Write-Host "⚠️ recompensas.ps1 no devolvió un txHash válido" -ForegroundColor Yellow
            return "ERROR"
        }
    } catch {
        Write-Host "⛔ Error recompensas: $($_.Exception.Message)" -ForegroundColor Red
        return "ERROR"
    }
}

# --- Ejecutar publicaciones del día ---
$hoy = (Get-Date).Day
foreach ($t in $tareas) {
    if ($t.Dia -eq $hoy -and $t.Mensaje.Trim() -ne "") {
        try {
            $twId = Publicar-Twitter $t.Mensaje
            $tgId = Publicar-Telegram $t.Mensaje
            $dcId = Publicar-Discord $t.Mensaje
            $txId = Distribuir-Recompensas $t.Dia $t.Categoria $t.Mensaje

            $logEntry = [PSCustomObject]@{
                fecha     = (Get-Date).ToString("s")
                timestamp = [int][double]::Parse((Get-Date -UFormat %s))
                dia       = $t.Dia
                categoria = $t.Categoria
                mensaje   = $t.Mensaje
                twitter_id   = $twId
                telegram_id  = $tgId
                discord_id   = $dcId
                txHash       = $txId
                publicado    = $true
                recompensa_distribuida = ($txId -ne "ERROR")
            } | ConvertTo-Json -Compress

            Add-Content -Path $LogOut -Value $logEntry
            Write-Host "✅ Publicación y recompensa registradas en $LogOut"
        }
        catch {
            Write-Host "⛔ Error al publicar Día $($t.Dia): $($_.Exception.Message)" -ForegroundColor Red

            $errorEntry = [PSCustomObject]@{
                fecha     = (Get-Date).ToString("s")
                timestamp = [int][double]::Parse((Get-Date -UFormat %s))
                dia       = $t.Dia
                categoria = $t.Categoria
                mensaje   = $t.Mensaje
                error     = $_.Exception.Message
                publicado = $false
            } | ConvertTo-Json -Compress

            Add-Content -Path $LogOut -Value $errorEntry
        }
    }
}