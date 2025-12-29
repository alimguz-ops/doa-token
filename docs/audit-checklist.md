# DOA Token – Audit Checklist

Este documento define los puntos clave que deben revisarse en cada auditoría del DOA Token.  
Sirve como guía para auditores internos y externos, garantizando consistencia y transparencia.

---

## 📋 Checklist Técnico

- [ ] Verificación del contrato inteligente en PolygonScan.  
- [ ] Validación de proxy y `deployments.json`.  
- [ ] Revisión de funciones críticas (transfer, burn, mint).  
- [ ] Confirmación de supply total y balances (`checkTotalSupply.js`, `checkAllBalances.js`).  
- [ ] Seguridad en scripts de monitoreo (`monitor-liquidez.js`).  
- [ ] Logs claros y auditables en `audit-log.md`.  

---

## 📋 Checklist Legal

- [ ] Certificación de no-valor (`legal/certification.md`).  
- [ ] Políticas AML/KYC documentadas (`legal/AML-KYC.md`).  
- [ ] Cumplimiento regulatorio en jurisdicciones clave.  
- [ ] Documentación legal actualizada en `legal/`.  

---

## 📋 Checklist Operacional

- [ ] Registro de auditorías en `audit-log.md`.  
- [ ] Publicación de resultados en `announcement.md`.  
- [ ] Actualización de métricas comunitarias (`community-metrics.md`).  
- [ ] Validación de gobernanza (`governance-log.md`).  

---

## 📋 Checklist de Seguridad

- [ ] Revisión de permisos en contratos.  
- [ ] Validación de integridad en scripts y `.env`.  
- [ ] Confirmación de uso de `gitignore` y pre-commit hooks.  
- [ ] Pruebas de resistencia contra ataques comunes (reentrancy, overflow).  

---

## 📌 Notas

- Este checklist debe completarse en cada auditoría y adjuntarse al reporte oficial (`audit-report.md`).  
- Forma parte del paquete de auditoría junto con `audit-log.md` y `audit-report.md`.  
- La consistencia en auditorías fortalece la confianza de la comunidad y exchanges.