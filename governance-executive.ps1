# governance-executive.ps1
# Genera un reporte ejecutivo resumido de gobernanza DOA Token

param(
    [string]$Year = (Get-Date -Format "yyyy")
)

$reportDir = "docs/legal/reports/$Year"
$execReportPath = "$reportDir/executive-report.md"

if (-not (Test-Path $reportDir)) {
    Write-Host "No existen reportes para el año $Year."
    exit
}

# Inicializar acumuladores
$totalDecisiones = 0
$totalAuditorias = 0
$totalIncidentes = 0

# Recorrer cada carpeta mensual
Get-ChildItem -Path $reportDir -Directory | ForEach-Object {
    $summaryFile = "$($_.FullName)/../governance-monthly-summary.txt"
    if (Test-Path $summaryFile) {
        foreach ($line in Get-Content $summaryFile) {
            if ($line -match "Decisiones") { $totalDecisiones += [int]($line.Split("=")[1]) }
            elseif ($line -match "Auditorias") { $totalAuditorias += [int]($line.Split("=")[1]) }
            elseif ($line -match "Incidentes") { $totalIncidentes += [int]($line.Split("=")[1]) }
        }
    }
}

# Crear reporte ejecutivo en Markdown
$reportContent = @"
# Reporte Ejecutivo de Gobernanza – $Year

**Métricas Clave:**
- Decisiones: $totalDecisiones
- Auditorías: $totalAuditorias
- Incidentes: $totalIncidentes

Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd")

![Gráfico ejecutivo](executive-report-chart.png)  
![Proporción ejecutiva](executive-report-pie.png)
"@

Set-Content -Path $execReportPath -Value $reportContent

# Crear gráficos con Python
$chartScript = @"
import matplotlib.pyplot as plt

values = [$totalDecisiones, $totalAuditorias, $totalIncidentes]
labels = ['Decisiones','Auditorías','Incidentes']

# Gráfico de barras ejecutivo
plt.figure(figsize=(6,4))
plt.bar(labels, values, color=['#4CAF50','#2196F3','#F44336'])
plt.title('Métricas Ejecutivas – $Year')
plt.ylabel('Cantidad')
plt.savefig('$reportDir/executive-report-chart.png')
plt.close()

# Gráfico de pastel ejecutivo
if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Ejecutiva – $Year')
    plt.savefig('$reportDir/executive-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este año', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('$reportDir/executive-report-pie.png')
    plt.close()
"@

Set-Content -Path "$reportDir/executive-report-chart.py" -Value $chartScript
python "$reportDir/executive-report-chart.py"

Write-Host "✅ Reporte ejecutivo generado en $execReportPath con métricas clave y gráficos."
