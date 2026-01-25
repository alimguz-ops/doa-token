---
layout: default
title: audit-checklist
---

# 🔒 DOA Token – Audit Checklist  
# 🔒 DOA Token – Lista de Verificación de Auditoría

Este documento define los puntos clave que deben revisarse en cada auditoría del DOA Token.  
Sirve como guía para auditores internos y externos, garantizando consistencia y transparencia.  
This document defines the key points to be reviewed in each DOA Token audit.  
It serves as a guide for internal and external auditors, ensuring consistency and transparency.  

---

## 📋 Checklist Técnico / Technical Checklist
- [ ] Verificación del contrato inteligente en **PolygonScan y Etherscan**.  
- [ ] Validación de proxy y `deployments.json`.  
- [ ] Revisión de funciones críticas (`transfer`, `burn`, `mint`).  
- [ ] Confirmación de supply total y balances (`checkTotalSupply.js`, `checkAllBalances.js`).  
- [ ] Seguridad en scripts de monitoreo (`monitor-liquidez.js`).  
- [ ] Logs claros y auditables en `audit-log.md`.  

---

## 📋 Checklist Legal / Legal Checklist
- [ ] Certificación de no-valor (`legal/certification.md`).  
- [ ] Políticas AML/KYC documentadas (`legal/AML-KYC.md`).  
- [ ] Cumplimiento regulatorio en jurisdicciones clave.  
- [ ] Documentación legal actualizada en `legal/`.  

---

## 📋 Checklist Operacional / Operational Checklist
- [ ] Registro de auditorías en `audit-log.md`.  
- [ ] Publicación de resultados en `announcement.md`.  
- [ ] Actualización de métricas comunitarias (`community-metrics.md`).  
- [ ] Validación de gobernanza (`governance-log.md`).  

---

## 📋 Checklist de Seguridad / Security Checklist
- [ ] Revisión de permisos en contratos.  
- [ ] Validación de integridad en scripts y `.env`.  
- [ ] Confirmación de uso de `gitignore` y pre-commit hooks.  
- [ ] Pruebas de resistencia contra ataques comunes (reentrancy, overflow).  

---

## 📌 Notas / Notes
- Este checklist debe completarse en cada auditoría y adjuntarse al reporte oficial (`audit-report.md`).  
- Forma parte del paquete de auditoría junto con `audit-log.md` y `audit-report.md`.  
- La consistencia en auditorías fortalece la confianza de la comunidad y exchanges.  
- This checklist must be completed in each audit and attached to the official report (`audit-report.md`).  
- It is part of the audit package together with `audit-log.md` and `audit-report.md`.  
- Consistency in audits strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
