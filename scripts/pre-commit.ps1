Write-Host "🔒 Ejecutando verificación pre-commit..."

if (-not (Test-Path ".env.lock")) {
    Write-Host "❌ Falta archivo .env.lock. Commit bloqueado."
    exit 1
}

# Leer candado
$lockLine = Get-Content ".env.lock" | Where-Object { $_ -match "^LOCK=" }
$lockHash = ($lockLine -split "=")[1].ToLower()

# Validar candado
if ($env:LOCK -ne $lockHash) {
    Write-Host "❌ Candado no coincide con variable de entorno. Commit bloqueado."
    exit 1
}

# Validar frase personal
$secretPhrase = "micieloOmg16"
if ($env:PHRASE -ne $secretPhrase) {
    Write-Host "❌ Frase personal incorrecta o no configurada. Commit bloqueado."
    exit 1
}

Write-Host "✅ Verificación correcta. Commit permitido."
exit 0