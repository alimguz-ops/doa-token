# scripts/publicar.ps1
# Publica mensajes del calendario y ejecuta recompensas en AutoDistributor

param(
    [string]$JsonPath = (Join-Path $PSScriptRoot '..\automation\calendario.json'),
    [string]$LogOut   = (Join-Path $PSScriptRoot '..\logs\publicaciones.jsonl')
)

$ProjectRoot = (Split-Path $PSScriptRoot -Parent)
$envPath = (Join-Path $ProjectRoot '.env')
if (-not (Test-Path $envPath)) {
    throw 'No se encontró .env en ' + $ProjectRoot
}

# --- Cargar .env ---
Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*#' -or $_.Trim() -eq '') { return }
    $parts = $_ -split '=', 2
    if ($parts.Count -eq 2) {
        $key = $parts[0].Trim()
        $val = $parts[1].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $val, 'Process')
    }
}

# --- Actualizar deployments antes de publicar ---
try {
    node (Join-Path $PSScriptRoot '..\scripts\updateDeployment.cjs')
    Write-Host 'deployments.json actualizado correctamente' -ForegroundColor Green
} catch {
    Write-Host ('Error al actualizar deployments.json: ' + $_.Exception.Message) -ForegroundColor Yellow
}

# --- Credenciales ---
$twitterBearer = $env:TWITTER_BEARER_TOKEN
$telegramToken = $env:TELEGRAM_BOT_TOKEN
$telegramChat  = $env:TELEGRAM_CHAT_ID
$discordHook   = $env:DISCORD_WEBHOOK_URL
$siteUrl       = $env:SITE_URL

if (-not $twitterBearer) { throw 'Falta TWITTER_BEARER_TOKEN en .env' }
if (-not $telegramToken -or -not $telegramChat) { throw 'Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en .env' }
if (-not $discordHook) { throw 'Falta DISCORD_WEBHOOK_URL en .env' }
if (-not $siteUrl) { throw 'Falta SITE_URL en .env' }

# --- Validar calendario ---
if (-not (Test-Path $JsonPath)) {
    throw 'No se encontró el archivo de calendario en ' + $JsonPath
}
$tareas = Get-Content $JsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $tareas) {
    throw 'El calendario está vacío o malformado en ' + $JsonPath
}

# --- Validar archivo de log ---
if (-not (Test-Path $LogOut)) {
    New-Item -ItemType File -Force -Path $LogOut | Out-Null
}

# --- Funciones de publicación ---
function Publicar-Twitter($mensaje) {
    try {
        $contenido = $mensaje + "`n" + $siteUrl
        $url = 'https://api.twitter.com/2/tweets'
        $headers = @{ Authorization = ('Bearer ' + $twitterBearer) }
        $body = @{ text = $contenido } | ConvertTo-Json -Compress
        $res = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType 'application/json'
        if ($null -ne $res.data.id) { return $res.data.id } else { return 'ERROR: Respuesta inesperada de Twitter' }
    } catch { return ('ERROR: ' + $_.Exception.Message) }
}

function Publicar-Telegram($mensaje) {
    try {
        $contenido = $mensaje + "`n" + $siteUrl
        $url = ('https://api.telegram.org/bot' + $telegramToken + '/sendMessage')
        $res = Invoke-RestMethod -Uri $url -Method Post -Body @{ chat_id = $telegramChat; text = $contenido }
        return $res.result.message_id
    } catch { return ('ERROR: ' + $_.Exception.Message) }
}

function Publicar-Discord($mensaje) {
    try {
        $contenido = $mensaje + "`n" + $siteUrl
        $body = @{ content = $contenido } | ConvertTo-Json
        Invoke-RestMethod -Uri $discordHook -Method Post -Body $body -ContentType 'application/json'
        return 'OK'
    } catch { return ('ERROR: ' + $_.Exception.Message) }
}
function Distribuir-Recompensas($accion) {
    try {
        $scriptPath = (Join-Path $PSScriptRoot 'recompensas.ps1')
        $res = & $scriptPath -Accion $accion
        return $res
    } catch { return ('ERROR: ' + $_.Exception.Message) }
}

# --- Ejecutar publicaciones del día ---
$hoy = (Get-Date).Day
foreach ($t in $tareas) {
    if (-not $t.PSObject.Properties['Dia'] -or -not $t.PSObject.Properties['Mensaje']) {
        Write-Host ('Entrada inválida en calendario: ' + ($t | ConvertTo-Json -Compress)) -ForegroundColor Yellow
        continue
    }

    if ($t.Dia -eq $hoy -and $t.Mensaje.Trim() -ne '') {
        try {
            $twId = Publicar-Twitter $t.Mensaje
            $tgId = Publicar-Telegram $t.Mensaje
            $dcId = Publicar-Discord $t.Mensaje
            $txId = $null
            if ($t.accion) { $txId = Distribuir-Recompensas $t.accion }

            $logEntry = [PSCustomObject]@{
                fecha     = (Get-Date).ToString('s');
                timestamp = [int][double]::Parse((Get-Date -UFormat %s));
                dia       = $t.Dia;
                categoria = $t.Categoria;
                mensaje   = $t.Mensaje;
                twitter_id   = $twId;
                telegram_id  = $tgId;
                discord_id   = $dcId;
                txHash       = $txId;
                publicado    = $true;
                recompensa_distribuida = ($txId -and $txId -notlike 'ERROR*');
            } | ConvertTo-Json -Compress

            Add-Content -Path $LogOut -Value $logEntry
        }
        catch {
            $errorEntry = [PSCustomObject]@{
                fecha     = (Get-Date).ToString('s');
                timestamp = [int][double]::Parse((Get-Date -UFormat %s));
                dia       = $t.Dia;
                categoria = $t.Categoria;
                mensaje   = $t.Mensaje;
                error     = $_.Exception.Message;
                publicado = $false;
            } | ConvertTo-Json -Compress

            Add-Content -Path $LogOut -Value $errorEntry
        }
    }
}
