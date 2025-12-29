# governance-annual.ps1
# Genera un reporte anual consolidado de gobernanza DOA Token

param(
    [string]$Year = (Get-Date -Format "yyyy")
)

$reportDir = "docs/legal/reports/$Year"
$annualReportPath = "$reportDir/annual-report.md"

if (-not (Test-Path $reportDir)) {
    Write-Host "No existen reportes para el año $Year."
    exit
}

# Inicializar acumuladores
$months = @()
$decisiones = @()
$auditorias = @()
$incidentes = @()

# Recorrer cada carpeta mensual
Get-ChildItem -Path $reportDir -Directory | ForEach-Object {
    $monthName = $_.Name
    $summaryFile = "$($_.FullName)/../governance-monthly-summary.txt"

    if (Test-Path $summaryFile) {
        $d = 0; $a = 0; $i = 0
        foreach ($line in Get-Content $summaryFile) {
            if ($line -match "Decisiones") { $d = [int]($line.Split("=")[1]) }
            elseif ($line -match "Auditorias") { $a = [int]($line.Split("=")[1]) }
            elseif ($line -match "Incidentes") { $i = [int]($line.Split("=")[1]) }
        }
        $months += $monthName
        $decisiones += $d
        $auditorias += $a
        $incidentes += $i
    }
}

# Crear reporte anual en Markdown
$reportContent = @"
# Reporte Anual de Gobernanza – $Year

| Mes        | Decisiones | Auditorías | Incidentes |
|------------|------------|------------|------------|
"@

for ($j=0; $j -lt $months.Count; $j++) {
    $reportContent += "| $($months[$j]) | $($decisiones[$j]) | $($auditorias[$j]) | $($incidentes[$j]) |`n"
}

$reportContent += @"

Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd")

![Gráfico anual](annual-report-chart.png)
"@

Set-Content -Path $annualReportPath -Value $reportContent

# Crear gráficos con Python
$chartScript = @"
import matplotlib.pyplot as plt

months = [" + ($months | ForEach-Object { "'$_'" } -join ",") + @"]
decisiones = [" + ($decisiones | ForEach-Object { $_ } -join ",") + @"]
auditorias = [" + ($auditorias | ForEach-Object { $_ } -join ",") + @"]
incidentes = [" + ($incidentes | ForEach-Object { $_ } -join ",") + @"]

# Gráfico de evolución anual
plt.figure(figsize=(10,6))
plt.plot(months, decisiones, marker='o', label='Decisiones', color='#4CAF50')
plt.plot(months, auditorias, marker='o', label='Auditorías', color='#2196F3')
plt.plot(months, incidentes, marker='o', label='Incidentes', color='#F44336')
plt.title('Evolución de Gobernanza – $Year')
plt.xlabel('Mes')
plt.ylabel('Cantidad')
plt.legend()
plt.grid(True)
plt.savefig('$reportDir/annual-report-chart.png')
plt.close()

# Gráfico de pastel consolidado
total_decisiones = sum(decisiones)
total_auditorias = sum(auditorias)
total_incidentes = sum(incidentes)
values = [total_decisiones, total_auditorias, total_incidentes]
labels = ['Decisiones','Auditorías','Incidentes']

if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Total – $Year')
    plt.savefig('$reportDir/annual-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este año', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('$reportDir/annual-report-pie.png')
    plt.close()
"@