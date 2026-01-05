Write-Host "Ejecutando verificación pre-push..."

# Leer el candado desde .env.lock
if (Test-Path ".env.lock") {
    $lockHash = (Get-Content ".env.lock" | ForEach-Object { ($_ -split "=")[1] }).ToLower()

    # Validar que la variable de entorno LOCK coincida con el candado
    if ($env:LOCK -ne $lockHash) {
        Write-Host "Candado no coincide con variable de entorno. Push bloqueado."
        exit 1
    }

    # Validar frase personal
    $secretPhrase = "micieloOmg16"
    if ($env:PHRASE -ne $secretPhrase) {
        Write-Host "Frase personal incorrecta o no configurada. Push bloqueado."
        exit 1
    } else {
        Write-Host "Verificación correcta. Push permitido."
    }
}

Write-Host "Pre-push check passed."
exit 0
