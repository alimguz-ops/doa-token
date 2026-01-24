# scripts/ejecutar-campania.ps1
# Orquestador diario: ejecuta publicar.ps1 para enviar mensajes y registrar auditoría

param(
    [string]$PublicarScript = (Join-Path $PSScriptRoot "publicar.ps1")
)

# --- Validar existencia de publicar.ps1 ---
if (-not (Test-Path $PublicarScript)) {
    Write-Host "❌ No se encontró el script: $PublicarScript" -ForegroundColor Red
    exit 1
}

try {
    Write-Host "▶ Ejecutando campaña diaria..." -ForegroundColor Cyan

    # Ejecutar publicar.ps1 y capturar salida
    $output = & $PublicarScript 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "El script publicar.ps1 terminó con código de error $LASTEXITCODE"
    }

    # Guardar salida en log
    $logPath = Join-Path $PSScriptRoot "logs\ejecutar-campania.log"
    $output | Out-File -FilePath $logPath -Append

    Write-Host "✅ Campaña completada. Revisa logs/publicaciones.json y $logPath para auditoría." -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al ejecutar publicar.ps1" -ForegroundColor Red
    Write-Host $_.Exception.ToString() -ForegroundColor DarkRed
    exit 1
}