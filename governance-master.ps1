# governance-master.ps1
# Script maestro para registrar gobernanza DOA Token en un solo paso
# Uso: .\governance-master.ps1 "CONTRATO" "ACCION" "ESTADO" "IMPACTO" "ENLACE"

param(
    [string]$Contrato,
    [string]$Accion,
    [string]$Estado,
    [string]$Impacto,
    [string]$Enlace
)

$Fecha = Get-Date -Format "yyyy-MM-dd"
$Year = Get-Date -Format "yyyy"
$Month = Get-Date -Format "MMMM"

function Append-ToFile($path, $content) {
    Add-Content -Path $path -Value $content
}

# --- Actualización de archivos individuales ---
Append-ToFile "docs/legal/contracts-governance-decision.md" @"
- **Fecha:** $Fecha  
- **Contrato Afectado:** $Contrato  
- **Descripción de la Decisión:** $Accion  
- **Impacto Esperado:** $Impacto  
- **Estado:** $Estado  
- **Enlaces:** $Enlace
"@

Append-ToFile "docs/legal/contracts-governance-versioning.md" @"
- **Fecha:** $Fecha  
- **Versión Nueva:** $Accion  
- **Contrato:** $Contrato  
- **Estado:** $Estado
"@

Append-ToFile "docs/legal/contracts-governance-changelog.md" "- [$Fecha] $Accion en contrato $Contrato → Estado: $Estado"

Append-ToFile "docs/legal/contracts-governance-deploy.md" "- **Fecha:** $Fecha  `n- **Contrato:** $Contrato  `n- **Acción:** $Accion  `n- **Estado:** $Estado"
Append-ToFile "docs/legal/contracts-governance-migration.md" "- **Fecha:** $Fecha  `n- **Contrato Migrado:** $Contrato  `n- **Acción:** $Accion  `n- **Estado:** $Estado"
Append-ToFile "docs/legal/contracts-governance-transfer.md" "- **Fecha:** $Fecha  `n- **Contrato Transferido:** $Contrato  `n- **Acción:** $Accion  `n- **Estado:** $Estado"
Append-ToFile "docs/legal/contracts-governance-ownership.md" "- **Fecha:** $Fecha  `n- **Contrato Afectado:** $Contrato  `n- **Propiedad:** $Accion  `n- **Estado:** $Estado"

Append-ToFile "docs/legal/contracts-governance-audit.md" "- **Fecha:** $Fecha  `n- **Contrato Auditado:** $Contrato  `n- **Hallazgo:** $Accion  `n- **Impacto:** $Impacto  `n- **Estado:** $Estado"
Append-ToFile "docs/legal/contracts-governance-risk.md" "- **Fecha:** $Fecha  `n- **Contrato Afectado:** $Contrato  `n- **Riesgo:** $Accion  `n- **Impacto:** $Impacto  `n- **Estado:** $Estado"
Append-ToFile "docs/legal/contracts-governance-incidents.md" "- **Fecha:** $Fecha  `n- **Contrato Afectado:** $Contrato  `n- **Incidente:** $Accion  `n- **Impacto:** $Impacto  `n- **Estado:** $Estado"

Append-ToFile "docs/legal/contracts-governance-transparency.md" "- **Fecha:** $Fecha  `n- **Acción Transparente:** $Accion  `n- **Contrato:** $Contrato  `n- **Estado:** $Estado  `n- **Enlace:** $Enlace"

# --- Log maestro organizado por Año/Mes con índice ---
$logPath = "docs/legal/governance-master-log.md"

if (-not (Test-Path $logPath)) {
    Add-Content -Path $logPath -Value "# Registro Maestro de Gobernanza DOA Token`n"
    Add-Content -Path $logPath -Value "## Índice`n"
}

$yearHeader = "## $Year"
if (-not (Select-String -Path $logPath -Pattern $yearHeader)) {
    Add-Content -Path $logPath -Value "`n$yearHeader"
    Add-Content -Path $logPath -Value "- [$Year](#$Year)"
}

$monthHeader = "### $Month"
if (-not (Select-String -Path $logPath -Pattern $monthHeader)) {
    Add-Content -Path $logPath -Value "`n$monthHeader"
    Add-Content -Path $logPath -Value "  - [$Month](#$Month)"
}

Append-ToFile $logPath @"
- [$Fecha]  
  - Contrato: $Contrato  
  - Acción: $Accion  
  - Estado: $Estado  
  - Impacto: $Impacto  
  - Enlace: $Enlace
"@

# --- Resumen mensual automático ---
$monthSummaryHeader = "#### Resumen $Month $Year"
if (-not (Select-String -Path $logPath -Pattern $monthSummaryHeader)) {
    Add-Content -Path $logPath -Value "`n$monthSummaryHeader"
}

$summaryPath = "docs/legal/governance-monthly-summary.txt"
if (-not (Test-Path $summaryPath)) {
    Set-Content -Path $summaryPath -Value "Decisiones=0`nAuditorias=0`nIncidentes=0"
}

$content = Get-Content $summaryPath | ForEach-Object {
    if ($_ -match "Decisiones") { 
        $val = [int]($_.Split("=")[1])
        "Decisiones=" + ($val + 1)
    }
    elseif ($_ -match "Auditorias" -and $Accion -match "Auditor") { 
        $val = [int]($_.Split("=")[1])
        "Auditorias=" + ($val + 1)
    }
    elseif ($_ -match "Incidentes" -and $Accion -match "Incidente") { 
        $val = [int]($_.Split("=")[1])
        "Incidentes=" + ($val + 1)
    }
    else { $_ }
}
Set-Content -Path $summaryPath -Value $content

$summary = Get-Content $summaryPath

Append-ToFile $logPath "`nResumen acumulado: $summary"

# --- Exportar reporte mensual en formato Markdown con gráficos ---
$reportDir = "docs/legal/reports/$Year/$Month"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
}

$reportPath = "$reportDir/monthly-report.md"

# Leer valores seguros
$decisiones = 0
$auditorias = 0
$incidentes = 0

foreach ($line in Get-Content $summaryPath) {
    if ($line -match "Decisiones") { $decisiones = [int]($line.Split("=")[1]) }
    elseif ($line -match "Auditorias") { $auditorias = [int]($line.Split("=")[1]) }
    elseif ($line -match "Incidentes") { $incidentes = [int]($line.Split("=")[1]) }
}

$reportContent = @"
# Reporte Mensual de Gobernanza – $Month $Year

| Métrica      | Cantidad |
|--------------|----------|
| Decisiones   | $decisiones |
| Auditorías   | $auditorias |
| Incidentes   | $incidentes |

Generado automáticamente el $Fecha

![Gráfico de métricas](monthly-report-chart.png)  
![Gráfico de proporciones](monthly-report-pie.png)
"@

Set-Content -Path $reportPath -Value $reportContent

# Crear gráficos con Python
$chartScript = @"
import matplotlib.pyplot as plt

labels = ['Decisiones','Auditorías','Incidentes']
values = [$decisiones, $auditorias, $incidentes]

# Gráfico de barras
plt.figure(figsize=(6,4))
plt.bar(labels, values, color=['#4CAF50','#2196F3','#F44336'])
plt.title('Métricas de Gobernanza – $Month $Year')
plt.ylabel('Cantidad')
plt.savefig('$reportDir/monthly-report-chart.png')
plt.close()

# Gráfico de pastel (solo si hay datos)
if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción de Métricas – $Month $Year')
    plt.savefig('$reportDir/monthly-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este mes', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('$reportDir/monthly-report-pie.png')
    plt.close()
"@

Set-Content -Path "$reportDir/monthly-report-chart.py" -Value $chart