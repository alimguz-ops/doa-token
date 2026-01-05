# lock-env.ps1
# Genera o actualiza el candado .env.lock con el hash SHA256 del archivo .env

if (-Not (Test-Path ".env")) {
    Write-Host "❌ No existe archivo .env en la raíz del proyecto."
    exit 1
}

# Calcular hash SHA256 del .env
$hash = (Get-FileHash ".env" -Algorithm SHA256).Hash.ToLower()

# Guardar hash en .env.lock (sin BOM, limpio)
Set-Content -Path ".env.lock" -Value "HASH=$hash" -Encoding ASCII

Write-Host "✅ Candado actualizado: .env.lock contiene el hash $hash"
