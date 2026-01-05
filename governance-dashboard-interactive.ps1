# governance-dashboard-interactive.ps1
# Genera un dashboard HTML interactivo con pestañas para todos los reportes

param(
    [string]$Year = (Get-Date -Format "yyyy")
)

$reportDir = "docs/legal/reports/$Year"
$dashboardPath = "$reportDir/dashboard-interactive.html"

if (-not (Test-Path $reportDir)) {
    Write-Host "No existen reportes para el año $Year."
    exit
}

$html = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Interactivo Gobernanza – $Year</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .tabs { display: flex; margin-bottom: 20px; }
        .tab { padding: 10px 20px; cursor: pointer; background: #eee; margin-right: 5px; border-radius: 5px; }
        .tab.active { background: #4CAF50; color: white; }
        .content { display: none; }
        .content.active { display: block; }
        img { max-width: 600px; margin: 10px 0; border: 1px solid #ccc; }
    </style>
    <script>
        function showTab(tabId) {
            var tabs = document.querySelectorAll('.content');
            tabs.forEach(function(tab) { tab.classList.remove('active'); });
            document.getElementById(tabId).classList.add('active');

            var buttons = document.querySelectorAll('.tab');
            buttons.forEach(function(btn) { btn.classList.remove('active'); });
            document.querySelector('[data-target="'+tabId+'"]').classList.add('active');
        }
    </script>
</head>
<body>
    <h1>Dashboard Interactivo de Gobernanza – $Year</h1>
    <p>Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd")</p>

    <div class="tabs">
        <div class="tab active" data-target="ejecutivo" onclick="showTab('ejecutivo')">Ejecutivo</div>
        <div class="tab" data-target="mensual" onclick="showTab('mensual')">Mensual</div>
        <div class="tab" data-target="trimestral" onclick="showTab('trimestral')">Trimestral</div>
        <div class="tab" data-target="anual" onclick="showTab('anual')">Anual</div>
        <div class="tab" data-target="multianual" onclick="showTab('multianual')">Multianual</div>
    </div>

    <div id="ejecutivo" class="content active">
        <h2>Reporte Ejecutivo</h2>
        <img src="executive-report-chart.png" alt="Gráfico Ejecutivo">
        <img src="executive-report-pie.png" alt="Proporción Ejecutiva">
    </div>

    <div id="mensual" class="content">
        <h2>Reporte Mensual</h2>
        <img src="monthly-report-chart.png" alt="Gráfico Mensual">
        <img src="monthly-report-pie.png" alt="Proporción Mensual">
    </div>

    <div id="trimestral" class="content">
        <h2>Reporte Trimestral</h2>
        <img src="quarterly-report-chart.png" alt="Gráfico Trimestral">
        <img src="quarterly-report-pie.png" alt="Proporción Trimestral">
    </div>

    <div id="anual" class="content">
        <h2>Reporte Anual</h2>
        <img src="annual-report-chart.png" alt="Gráfico Anual">
        <img src="annual-report-pie.png" alt="Proporción Anual">
    </div>

    <div id="multianual" class="content">
        <h2>Reporte Multianual</h2>
        <img src="../multiyear-report-chart.png" alt="Gráfico Multianual">
        <img src="../multiyear-report-pie.png" alt="Proporción Multianual">
    </div>
</body>
</html>
"@

Set-Content -Path $dashboardPath -Value $html

Write-Host "✅ Dashboard interactivo generado en $dashboardPath. Ábrelo en tu navegador para navegar entre los reportes."
