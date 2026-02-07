param(
    [string]$Accion = "verificar"
)

Write-Output "▶ Ejecutando recompensas.ps1 en modo verificación (acción: $Accion)"

try {
    # Ruta al script Node.js que contiene la lógica de verificación
    $scriptPath = Join-Path $PSScriptRoot "recompensas.js"

    if (-not (Test-Path $scriptPath)) {
        throw "No se encontró el archivo recompensas.js en $scriptPath"
    }

    # Ejecutar el script con Node y pasar la acción como argumento
    node $scriptPath $Accion
}
catch {
    Write-Host "❌ Error ejecutando recompensas.js: $($_.Exception.Message)" -ForegroundColor Red
}
