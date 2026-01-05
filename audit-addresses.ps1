# Auditoría de direcciones comprometidas en el repo DOA
Write-Output "🔎 Iniciando auditoría de direcciones comprometidas..."

# Lista de direcciones comprometidas
$badAddresses = @(
    '0x72851C1B53F1B369D476C1d406b65a855022F876',
    '0x2CC2eB354fba2f84E26a9D1c7ecfa7c2AeB841f8',
    '0x1A82D33B2A05087127a0548058e25A659742232D'
)

# Archivo de reporte
$report = "audit-report.txt"
Remove-Item $report -ErrorAction SilentlyContinue

foreach ($addr in $badAddresses) {
    Write-Output "`n➡️ Buscando $addr ..."
    Add-Content $report "`n➡️ Buscando $addr ..."
    Get-ChildItem -Recurse -File | Select-String -Pattern $addr | ForEach-Object {
        $lineReport = "   Archivo: $($_.Path) | Línea: $($_.Line)"
        Write-Output $lineReport
        Add-Content $report $lineReport
    }
}

Write-Output "`n✅ Auditoría completada. Revisa el archivo audit-report.txt para ver los resultados."

# Eliminación automática
foreach ($file in Get-ChildItem -Recurse -File) {
    $content = Get-Content $file.FullName
    foreach ($addr in $badAddresses) {
        $content = $content -replace $addr, ""
    }
    $content | Set-Content $file.FullName
}
Write-Output "Direcciones comprometidas eliminadas de los archivos"