import matplotlib.pyplot as plt

values = [0, 0, 0]
labels = ['Decisiones','Auditorías','Incidentes']

# Gráfico de barras ejecutivo
plt.figure(figsize=(6,4))
plt.bar(labels, values, color=['#4CAF50','#2196F3','#F44336'])
plt.title('Métricas Ejecutivas – 2025')
plt.ylabel('Cantidad')
plt.savefig('docs/legal/reports/2025/executive-report-chart.png')
plt.close()

# Gráfico de pastel ejecutivo
if sum(values) > 0:
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', colors=['#4CAF50','#2196F3','#F44336'])
    plt.title('Proporción Ejecutiva – 2025')
    plt.savefig('docs/legal/reports/2025/executive-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este año', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('docs/legal/reports/2025/executive-report-pie.png')
    plt.close()
