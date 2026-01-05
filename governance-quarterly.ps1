# governance-quarterly.ps1
# Genera un reporte trimestral consolidado de gobernanza DOA Token

param(
    [string]$Year = (Get-Date -Format "yyyy")
)

$reportDir = "docs/legal/reports/$Year"
$quarterReportPath = "$reportDir/quarterly-report.md"

if (-not (Test-Path $reportDir)) {
    Write-Host "No existen reportes para el año $Year."
    exit
}

# Inicializar acumuladores por trimestre
$quarters = @("Q1","Q2","Q3","Q4")
$decisionesQ = @(0,0,0,0)
$auditoriasQ = @(0,0,0,0)
$incidentesQ = @(0,0,0,0)

# Mapear meses a trimestres
$monthToQuarter = @{
    "January"="Q1"; "February"="Q1"; "March"="Q1";
    "April"="Q2"; "May"="Q2"; "June"="Q2";
    "July"="Q3"; "August"="Q3"; "September"="Q3";
    "October"="Q4"; "November"="Q4"; "December"="Q4"
}

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
        $q = $monthToQuarter[$monthName]
        $idx = $quarters.IndexOf($q)
        $decisionesQ[$idx] += $d
        $auditoriasQ[$idx] += $a
        $incidentesQ[$idx] += $i
    }
}

# Crear reporte trimestral en Markdown
$reportContent = @"
# Reporte Trimestral de Gobernanza – $Year

| Trimestre | Decisiones | Auditorías | Incidentes |
|-----------|------------|------------|------------|
"@

for ($j=0; $j -lt $quarters.Count; $j++) {
    $reportContent += "| $($quarters[$j]) | $($decisionesQ[$j]) | $($auditoriasQ[$j]) | $($incidentesQ[$j]) |`n"
}

$reportContent += @"

Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd")

![Gráfico trimestral](quarterly-report-chart.png)  
![Gráfico de proporciones](quarterly-report-pie.png)
"@

Set-Content -Path $quarterReportPath -Value $reportContent

# Crear gráficos con Python
$chartScript = @"
import matplotlib.pyplot as plt

quarters = ['Q1','Q2','Q3','Q4']
decisiones = [" + ($decisionesQ -join ",") + @"]
auditorias = [" + ($auditoriasQ -join ",") + @"]
incidentes = [" + ($incidentesQ -join ",") + @"]

# Gráfico de evolución trimestral
plt.figure(figsize=(8,5))
plt.plot(quarters, decisiones, marker='o', label='Decisiones', color='#4CAF50')
plt.plot(quarters, auditorias, marker='o', label='Auditorías', color='#2196F3')
plt.plot(quarters, incidentes, marker='o', label='Incidentes', color='#F44336')
plt.title('Evolución Trimestral de Gobernanza – $Year')
plt.xlabel('Trimestre')
plt.ylabel('Cantidad')
plt.legend()
plt.grid(True)
plt.savefig('$reportDir/quarterly-report-chart.png')
plt.close()

# Gráfico de pastel consolidado
values = [sum(decisiones), sum(auditorias), sum(incidentes)]
labels = ['Decisiones','Auditorías','Incidentes']

if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Total – $Year')
    plt.savefig('$reportDir/quarterly-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este año', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('$reportDir/quarterly-report-pie.png')
    plt.close()
"@
