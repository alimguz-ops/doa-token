import matplotlib.pyplot as plt

years = [" + (2024 2025 | ForEach-Object { "''" } -join ",") + @"]
decisiones = [" + (0 0 -join ",") + @"]
auditorias = [" + (0 0 -join ",") + @"]
incidentes = [" + (0 0 -join ",") + @"]

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
plt.savefig('docs/legal/reports/multiyear-report-chart.png')
plt.close()

# Gráfico de pastel consolidado
values = [sum(decisiones), sum(auditorias), sum(incidentes)]
labels = ['Decisiones','Auditorías','Incidentes']

if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Total Multianual')
    plt.savefig('docs/legal/reports/multiyear-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos multianuales', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('docs/legal/reports/multiyear-report-pie.png')
    plt.close()
