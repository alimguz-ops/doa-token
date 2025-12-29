# governance-dashboard.ps1
# Genera un dashboard HTML con todos los reportes de gobernanza

param(
    [string]$Year = (Get-Date -Format "yyyy")
)

$reportDir = "docs/legal/reports/$Year"
$dashboardPath = "$reportDir/dashboard.html"

if (-not (Test-Path $reportDir)) {
    Write-Host "No existen reportes para el año $Year."
    exit
}

# Construir HTML
$html = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Gobernanza – $Year</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        h2 { margin-top: 40px; }
        img { max-width: 600px; margin: 10px 0; border: 1px solid #ccc; }
        .section { margin-bottom: 50px; }
    </style>
</head>
<body>
    <h1>Dashboard de Gobernanza – $Year</h1>
    <p>Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd")</p>

    <div class="section">
        <h2>Reporte Ejecutivo</h2>
        <img src="executive-report-chart.png" alt="Gráfico Ejecutivo">
        <img src="executive-report-pie.png" alt="Proporción Ejecutiva">
    </div>

    <div class="section">
        <h2>Reporte Mensual</h2>
        <img src="monthly-report-chart.png" alt="Gráfico Mensual">
        <img src="monthly-report-pie.png" alt="Proporción Mensual">
    </div>

    <div class="section">
        <h2>Reporte Trimestral</h2>
        <img src="quarterly-report-chart.png" alt="Gráfico Trimestral">
        <img src="quarterly-report-pie.png" alt="Proporción Trimestral">
    </div>

    <div class="section">
        <h2>Reporte Anual</h2>
        <img src="annual-report-chart.png" alt="Gráfico Anual">
        <img src="annual-report-pie.png" alt="Proporción Anual">
    </div>

    <div class="section">
        <h2>Reporte Multianual</h2>
        <img src="../multiyear-report-chart.png" alt="Gráfico Multianual">
        <img src="../multiyear-report-pie.png" alt="Proporción Multianual">
    </div>
</body>
</html>
"@

Set-Content -Path $dashboardPath -Value $html

Write-Host "✅ Dashboard generado en $dashboardPath. Ábrelo en tu navegador para visualizar todos los gráficos."