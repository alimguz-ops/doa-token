import matplotlib.pyplot as plt

quarters = ['Q1','Q2','Q3','Q4']
decisiones = 0 0 0 0
auditorias = 0 0 0 0
incidentes = 0 0 0 0

# Gráfico de evolución trimestral
plt.figure(figsize=(8,5))
plt.plot(quarters, decisiones, marker='o', label='Decisiones', color='#4CAF50')
plt.plot(quarters, auditorias, marker='o', label='Auditorías', color='#2196F3')
plt.plot(quarters, incidentes, marker='o', label='Incidentes', color='#F44336')
plt.title('Evolución Trimestral de Gobernanza – 2025')
plt.xlabel('Trimestre')
plt.ylabel('Cantidad')
plt.legend()
plt.grid(True)
plt.savefig('docs/legal/reports/2025/quarterly-report-chart.png')
plt.close()

# Gráfico de pastel consolidado
values = [sum(decisiones), sum(auditorias), sum(incidentes)]
labels = ['Decisiones','Auditorías','Incidentes']

if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Total – 2025')
    plt.savefig('docs/legal/reports/2025/quarterly-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este año', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('docs/legal/reports/2025/quarterly-report-pie.png')
    plt.close()
