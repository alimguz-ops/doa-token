# update-flow.ps1
# Script para automatizar el flujo completo de actualización

Write-Host "🔐 Configurando frase personal..."
$env:DOA_SECRET_PHRASE = "micieloOmg16"

Write-Host "🔄 Regenerando candado..."
./lock-env.ps1

Write-Host "📦 Preparando commit con TODOS los cambios..."
git add -A
git commit -m "Actualización completa: candado y scripts"

Write-Host "🚀 Subiendo cambios..."
git push origin main

Write-Host "✅ Flujo completado correctamente."
