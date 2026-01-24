# scripts/contar-tweets.ps1
# Cuenta cuántos tweets se han publicado en enero 2026

# Ruta del archivo de logs
$logPath = "$PSScriptRoot\..\logs\publicaciones.json"

# Verificar si el archivo existe
if (-not (Test-Path $logPath)) {
    Write-Host "No se encontró el archivo publicaciones.json"
    exit
}

# Leer y convertir el JSON
$contenido = Get-Content $logPath | ConvertFrom-Json

# Filtrar por plataforma Twitter y mes enero 2026
$tweets = $contenido | Where-Object {
    $_.plataforma -eq "Twitter" -and
    ($_.fecha -match "^2026-01")
}

# Mostrar resultados
$tweets | ForEach-Object { Write-Host "📅 Tweet publicado el $($_.fecha)" }
Write-Host "`n✅ Total de tweets publicados en enero 2026: $($tweets.Count)"