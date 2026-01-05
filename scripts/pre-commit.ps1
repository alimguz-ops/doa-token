Write-Host "Ejecutando verificación pre-commit..."

if (Test-Path ".env") {
    $actualHash = (Get-FileHash ".env" -Algorithm SHA256).Hash.ToLower()
    $lockHash = (Get-Content ".env.lock" | ForEach-Object { ($_ -split "=")[1] }).ToLower()

    if ($actualHash -ne $lockHash) {
        Write-Host "El archivo .env no coincide con el candado. Commit bloqueado."
        exit 1
    }

    $secretPhrase = "micieloOmg16"
    if ($env:DOA_SECRET_PHRASE -ne $secretPhrase) {
        Write-Host "Frase personal incorrecta o no configurada. Commit bloqueado."
        exit 1
    } else {
        Write-Host "Verificación correcta. Commit permitido."
    }
}

Write-Host "Pre-commit check passed."
exit 0
