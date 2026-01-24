import matplotlib.pyplot as plt

months = [" + ( -join ",") + @"]
decisiones = [" + ( -join ",") + @"]
auditorias = [" + ( -join ",") + @"]
incidentes = [" + ( -join ",") + @"]

# Gráfico de evolución anual
plt.figure(figsize=(10,6))
plt.plot(months, decisiones, marker='o', label='Decisiones', color='#4CAF50')
plt.plot(months, auditorias, marker='o', label='Auditorías', color='#2196F3')
plt.plot(months, incidentes, marker='o', label='Incidentes', color='#F44336')
plt.title('Evolución de Gobernanza – 2025')
plt.xlabel('Mes')
plt.ylabel('Cantidad')
plt.legend()
plt.grid(True)
plt.savefig('docs/legal/reports/2025/annual-report-chart.png')
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
    plt.title('Proporción Total – 2025')
    plt.savefig('docs/legal/reports/2025/annual-report-pie.png')
    plt.close()
else:
    plt.figure(figsize=(6,6))
    plt.text(0.5, 0.5, 'Sin datos este año', ha='center', va='center', fontsize=14)
    plt.axis('off')
    plt.savefig('docs/legal/reports/2025/annual-report-pie.png')
    plt.close()
