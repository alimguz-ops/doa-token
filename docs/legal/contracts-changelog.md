---
layout: default
title: contracts-changelog
---

# 📜 DOA Token – Contracts Changelog  
# 📜 DOA Token – Registro de Cambios de Contratos

Este documento registra cronológicamente todos los cambios técnicos y legales aplicados a los contratos del DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.  
This document chronologically records all technical and legal changes applied to DOA Token contracts.  
Its purpose is to ensure traceability, transparency, and trust for auditors, the community, and exchanges.  

---

## 📋 Formato de Registro / Log Format

- **Fecha / Date:** YYYY-MM-DD  
- **Contrato / Contract:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance) / Contract name (e.g., ERC-20 Token, Liquidity Pool, Governance)  
- **Versión / Estado / Version / Status:** v1 | v2 | v3 | deprecated | migrated  
- **Tipo de Cambio / Change Type:** Técnico | Legal | Gobernanza | Seguridad / Technical | Legal | Governance | Security  
- **Descripción del Cambio / Change Description:** Breve explicación del ajuste realizado / Brief explanation of the adjustment made  
- **Motivo / Reason:** Razón del cambio (ej. optimización, migración, cumplimiento regulatorio) / Reason for the change (e.g., optimization, migration, regulatory compliance)  
- **Gobernanza / Governance:** Propuesta y votación vinculada en `governance-log.md` / Linked proposal and vote in `governance-log.md`  
- **Auditoría / Audit:** Validación en `contracts-audit.md` / Validation in `contracts-audit.md`  
- **Notas / Notes:** Observaciones relevantes / Relevant observations  
- **Enlaces / Links:** URLs a PolygonScan, repositorio o documentos legales / URLs to PolygonScan, repository, or legal documents  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Fecha / Date:** 2025-12-20  
- **Contrato / Contract:** DOA Token ERC-20  
- **Versión / Estado / Version / Status:** v1  
- **Tipo de Cambio / Change Type:** Técnico / Technical  
- **Descripción del Cambio / Change Description:** Deploy inicial con funciones básicas (`transfer`, `burn`, `mint`). / Initial deploy with basic functions (`transfer`, `burn`, `mint`).  
- **Motivo / Reason:** Lanzamiento oficial del token. / Official token launch.  
- **Gobernanza / Governance:** Propuesta P-001 – Aprobada por comunidad. / Proposal P-001 – Approved by community.  
- **Auditoría / Audit:** CertiK – issues-found (optimización de gas). / CertiK – issues-found (gas optimization).  
- **Notas / Notes:** Versión inicial marcada como `deprecated` tras migración a v2. / Initial version marked as `deprecated` after migration to v2.  
- **Enlaces / Links:**  
  - `contracts-log.md`  
  - `contracts-versioning.md`  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  

---

- **Fecha / Date:** 2026-03-01  
- **Contrato / Contract:** DOA Token ERC-20  
- **Versión / Estado / Version / Status:** v2  
- **Tipo de Cambio / Change Type:** Técnico + Gobernanza / Technical + Governance  
- **Descripción del Cambio / Change Description:** Migración a nueva versión con optimización de gas y funciones de gobernanza integradas. / Migration to new version with gas optimization and integrated governance functions.  
- **Motivo / Reason:** Reducción de costos de transacción y descentralización. / Reduction of transaction costs and decentralization.  
- **Gobernanza / Governance:** Propuesta P-003 – Aprobada por comunidad. / Proposal P-003 – Approved by community.  
- **Auditoría / Audit:** CertiK – validación sin hallazgos críticos. / CertiK – validation with no critical findings.  
- **Notas / Notes:** Contrato v2 activo y auditado, reemplazando v1. / Contract v2 active and audited, replacing v1.  
- **Enlaces / Links:**  
  - `contracts-migration.md`  
  - `contracts-audit.md`  
  - `contracts-roadmap.md`  

---

## 📌 Notas / Notes
- Cada cambio debe registrarse inmediatamente después de completarse.  
- Each change must be recorded immediately after completion.  

- Este archivo complementa `contracts-versioning.md`, `contracts-migration.md`, `contracts-audit.md` y `contracts-roadmap.md`.  
- This file complements `contracts-versioning.md`, `contracts-migration.md`, `contracts-audit.md`, and `contracts-roadmap.md`.  

- La trazabilidad en cambios fortalece la confianza de la comunidad y exchanges.  
- Traceability in changes strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
