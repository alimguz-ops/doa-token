---
layout: default
title: contracts-versioning
---

# 📦 DOA Token – Contracts Versioning Register  
# 📦 DOA Token – Registro de Versionado de Contratos

Este documento define el control de versiones y cambios técnicos aplicados a cada contrato inteligente del DOA Token.  
Su objetivo es garantizar trazabilidad, reproducibilidad y transparencia en la evolución de los contratos.  
This document defines version control and technical changes applied to each DOA Token smart contract.  
Its purpose is to ensure traceability, reproducibility, and transparency in the evolution of contracts.  

---

## 🛠 Principios de Versionado / Versioning Principles

1. **Transparencia / Transparency:** Cada versión debe estar documentada en este registro y vinculada a `contracts-log.md`.  
2. **Reproducibilidad / Reproducibility:** Los cambios deben ser claros, auditables y replicables en cualquier entorno.  
3. **Gobernanza / Governance:** Toda actualización debe estar vinculada a propuestas y votaciones en `governance-log.md`.  
4. **Auditoría / Audit:** Cada versión debe ser validada en `contracts-audit.md`.  

---

## 📋 Formato de Registro / Log Format

- **Contrato / Contract:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance) / Contract name (e.g., ERC-20 Token, Liquidity Pool, Governance)  
- **Versión / Version:** v1 | v2 | v3 | etc.  
- **Fecha de Publicación / Publication Date:** YYYY-MM-DD  
- **Cambios Principales / Main Changes:** Breve descripción de las modificaciones / Brief description of modifications  
- **Motivo / Reason:** Razón de la actualización (ej. optimización, seguridad, gobernanza) / Reason for the update (e.g., optimization, security, governance)  
- **Estado / Status:** `active` | `deprecated` | `migrated`  
- **Gobernanza / Governance:** Propuesta y votación vinculada en `governance-log.md` / Linked proposal and vote in `governance-log.md`  
- **Auditoría / Audit:** Validación en `contracts-audit.md` / Validation in `contracts-audit.md`  
- **Notas / Notes:** Observaciones relevantes / Relevant observations  
- **Enlaces / Links:** URLs a PolygonScan, repositorio o documentos legales / URLs to PolygonScan, repository, or legal documents  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Contrato / Contract:** DOA Token ERC-20  
- **Versión / Version:** v1  
- **Fecha de Publicación / Publication Date:** 2025-12-20  
- **Cambios Principales / Main Changes:** Deploy inicial con funciones básicas (`transfer`, `burn`, `mint`). / Initial deploy with basic functions (`transfer`, `burn`, `mint`).  
- **Motivo / Reason:** Lanzamiento oficial del token. / Official token launch.  
- **Estado / Status:** deprecated (migrado a v2). / deprecated (migrated to v2).  
- **Gobernanza / Governance:** Propuesta P-003 – Aprobada por comunidad. / Proposal P-003 – Approved by community.  
- **Auditoría / Audit:** CertiK – issues-found (optimización de gas). / CertiK – issues-found (gas optimization).  
- **Notas / Notes:** Versión inicial reemplazada por v2 con mejoras de seguridad. / Initial version replaced by v2 with security improvements.  
- **Enlaces / Links:**  
  - `contracts-log.md`  
  - `contracts-audit.md`  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  

---

## 📌 Notas / Notes
- Este archivo complementa `contracts-roadmap.md`, `contracts-migration.md`, `contracts-audit.md` y `contracts-log.md`.  
- This file complements `contracts-roadmap.md`, `contracts-migration.md`, `contracts-audit.md`, and `contracts-log.md`.  

- Debe actualizarse cada vez que se publique una nueva versión de contrato.  
- It must be updated each time a new contract version is published.  

- La trazabilidad en versionado fortalece la confianza de la comunidad y exchanges.  
- Traceability in versioning strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
