# governance-multiyear.ps1
# Genera un reporte multianual consolidado de gobernanza DOA Token

param(
    [string[]]$Years
)

$baseDir = "docs/legal/reports"
$multiReportPath = "$baseDir/multiyear-report.md"

# Inicializar acumuladores
$yearLabels = @()
$decisionesY = @()
$auditoriasY = @()
$incidentesY = @()

foreach ($Year in $Years) {
    $reportDir = "$baseDir/$Year"
    $summaryFile = "$reportDir/../governance-monthly-summary.txt"

    $totalD = 0; $totalA = 0; $totalI = 0

    if (Test-Path $reportDir) {
        # Recorrer cada carpeta mensual
        Get-ChildItem -Path $reportDir -Directory | ForEach-Object {
            $monthSummary = "$($_.FullName)/../governance-monthly-summary.txt"
            if (Test-Path $monthSummary) {
                foreach ($line in Get-Content $monthSummary) {
                    if ($line -match "Decisiones") { $totalD += [int]($line.Split("=")[1]) }
                    elseif ($line -match "Auditorias") { $totalA += [int]($line.Split("=")[1]) }
                    elseif ($line -match "Incidentes") { $totalI += [int]($line.Split("=")[1]) }
                }
            }
        }
    }

    $yearLabels += $Year
    $decisionesY += $totalD
    $auditoriasY += $totalA
    $incidentesY += $totalI
}

# Crear reporte multianual en Markdown
$reportContent = @"
# Reporte Multianual de Gobernanza

| Año | Decisiones | Auditorías | Incidentes |
|-----|------------|------------|------------|
"@

for ($j=0; $j -lt $yearLabels.Count; $j++) {
    $reportContent += "| $($yearLabels[$j]) | $($decisionesY[$j]) | $($auditoriasY[$j]) | $($incidentesY[$j]) |`n"
}

$reportContent += @"

Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd")

![Gráfico multianual](multiyear-report-chart.png)  
![Gráfico de proporciones](multiyear-report-pie.png)
"@

Set-Content -Path $multiReportPath -Value $reportContent

# Crear gráficos con Python
$chartScript = @"
import matplotlib.pyplot as plt

years = [" + ($yearLabels | ForEach-Object { "'$_'" } -join ",") + @"]
decisiones = [" + ($decisionesY | ForEach-Object { [string]$_ } -join ",") + @"]
auditorias = [" + ($auditoriasY | ForEach-Object { [string]$_ } -join ",") + @"]
incidentes = [" + ($incidentesY | ForEach-Object { [string]$_ } -join ",") + @"]

# Convertir a enteros explícitamente
decisiones = list(map(int, decisiones))
auditorias = list(map(int, auditorias))
incidentes = list(map(int, incidentes))

# Gráfico de evolución multianual
plt.figure(figsize=(8,5))
plt.plot(years, decisiones, marker='o', label='Decisiones', color='#4CAF50')
plt.plot(years, auditorias, marker='o', label='Auditorías', color='#2196F3')
plt.plot(years, incidentes, marker='o', label='Incidentes', color='#F44336')
plt.title('Evolución Multianual de Gobernanza')
plt.xlabel('Año')
plt.ylabel('Cantidad')
plt.legend()
plt.grid(True)
plt.savefig('$baseDir/multiyear-report-chart.png')
plt.close()

# Gráfico de pastel consolidado
values = [sum(decisiones), sum(auditorias), sum(incidentes)]
labels = ['Decisiones','Auditorías','Incidentes']

if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Total Multianual')
    plt.savefig('$baseDir/multiyear-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos multianuales', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('$baseDir/multiyear-report-pie.png')
    plt.close()
"@