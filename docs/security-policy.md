---
layout: default
title: security-policy
---

# 🔐 DOA Token – Security Policy  
# 🔐 DOA Token – Política de Seguridad

Este documento define las políticas de seguridad técnica y operativa del proyecto DOA Token.  
Su objetivo es garantizar integridad, protección de activos y confianza de la comunidad y exchanges.  
This document defines the technical and operational security policies of the DOA Token project.  
Its purpose is to ensure integrity, asset protection, and trust from the community and exchanges.  

---

## 🔐 Principios de Seguridad / Security Principles

1. **Integridad / Integrity:** Todos los contratos y scripts deben ser verificables y auditables. / All contracts and scripts must be verifiable and auditable.  
2. **Confidencialidad / Confidentiality:** Las claves privadas y archivos `.env` nunca deben compartirse ni almacenarse en repositorios públicos. / Private keys and `.env` files must never be shared or stored in public repositories.  
3. **Disponibilidad / Availability:** Los sistemas de monitoreo y liquidez deben estar activos y redundantes. / Monitoring and liquidity systems must remain active and redundant.  
4. **Transparencia / Transparency:** Cada cambio debe registrarse en `changelog.md` y `audit-log.md`. / Every change must be recorded in `changelog.md` and `audit-log.md`.  

---

## 📋 Políticas Técnicas / Technical Policies

- Uso obligatorio de `.env` para credenciales y configuraciones sensibles. / Mandatory use of `.env` for sensitive credentials and configurations.  
- Inclusión de `gitignore` para evitar exposición de archivos críticos. / Inclusion of `gitignore` to prevent exposure of critical files.  
- Implementación de **pre-commit hooks** para validar seguridad antes de cada push. / Implementation of **pre-commit hooks** to validate security before each push.  
- Scripts de monitoreo (`monitor-liquidez.js`) deben registrar logs claros y auditables. / Monitoring scripts (`monitor-liquidez.js`) must record clear and auditable logs.  
- Auditorías periódicas documentadas en `audit-report.md`. / Periodic audits documented in `audit-report.md`.  

---

## 📋 Políticas Operativas / Operational Policies

- Acceso a repositorios limitado por roles definidos en `governance-roles.md`. / Repository access limited by roles defined in `governance-roles.md`.  
- Revisión de permisos en contratos y wallets cada trimestre. / Quarterly review of permissions in contracts and wallets.  
- Validación de integridad en cada release (`releases.md`). / Integrity validation in each release (`releases.md`).  
- Publicación de incidentes de seguridad en `announcement.md`. / Publication of security incidents in `announcement.md`.  

---

## 📋 Políticas de Comunidad / Community Policies

- Comunicación inmediata de incidentes en canales oficiales (Twitter, Telegram, Discord). / Immediate communication of incidents in official channels (Twitter, Telegram, Discord).  
- Transparencia en votaciones de gobernanza relacionadas con seguridad (`governance-log.md`). / Transparency in governance votes related to security (`governance-log.md`).  
- Inclusión de métricas de seguridad en `community-metrics.md`. / Inclusion of security metrics in `community-metrics.md`.  

---

## 📌 Notas / Notes
- Este archivo complementa `audit-checklist.md`, `audit-log.md` y `audit-report.md`.  
- This file complements `audit-checklist.md`, `audit-log.md`, and `audit-report.md`.  

- Debe revisarse y actualizarse cada seis meses o tras cualquier incidente relevante.  
- It must be reviewed and updated every six months or after any relevant incident.  

- La seguridad operativa fortalece la confianza de la comunidad y exchanges.  
- Operational security strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
