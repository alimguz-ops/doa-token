# update-flow.ps1
# Script para automatizar el flujo de actualización con candado y hooks Husky

Write-Host "🔐 Configurando frase personal..."
$env:DOA_SECRET_PHRASE = "micieloOmg16"

Write-Host "🔄 Regenerando candado..."
./lock-env.ps1

Write-Host "📦 Preparando commit..."
git add .env.lock
git commit -m "Update candado .env.lock"

Write-Host "🚀 Subiendo cambios..."
git push origin main

Write-Host "✅ Flujo completado correctamente."
