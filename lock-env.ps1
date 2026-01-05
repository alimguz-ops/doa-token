# lock-env.ps1
# Genera o actualiza el candado .env.lock con el hash SHA256 del archivo .env

# Verificar si existe el archivo .env
if (-Not (Test-Path ".env")) {
    Write-Host "❌ No existe archivo .env en la raíz del proyecto."
    exit 1
}

# Calcular hash SHA256 del .env
$hash = Get-FileHash ".env" -Algorithm SHA256 | Select-Object -ExpandProperty Hash

# Guardar hash en .env.lock
"HASH=$hash" | Out-File ".env.lock" -Encoding ASCII

Write-Host "✅ Candado actualizado: .env.lock contiene el hash $hash"
