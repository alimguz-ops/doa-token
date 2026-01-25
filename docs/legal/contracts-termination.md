---
layout: default
title: contracts-termination
---

# 🛑 DOA Token – Contracts Termination Register  
# 🛑 DOA Token – Registro de Terminación de Contratos

Este documento registra la finalización, desactivación o migración de contratos inteligentes y legales asociados al DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.  
This document records the termination, deactivation, or migration of DOA Token smart and legal contracts.  
Its purpose is to ensure traceability, transparency, and trust for auditors, the community, and exchanges.  

---

## 📋 Formato de Registro / Log Format

- **Fecha / Date:** YYYY-MM-DD  
- **Tipo de Contrato / Contract Type:** Smart Contract | Legal Contract  
- **Nombre / Descripción / Name / Description:** Breve título del contrato / Brief contract title  
- **Dirección / Ubicación / Address / Location:** Dirección en blockchain o ruta de archivo legal / Blockchain address or legal file path  
- **Motivo de Terminación / Termination Reason:** Breve explicación (ej. migración, obsolescencia, decisión de gobernanza) / Brief explanation (e.g., migration, obsolescence, governance decision)  
- **Estado / Status:** `terminated` | `migrated` | `deprecated`  
- **Vinculación Gobernanza / Governance Link:** Propuesta y votación registrada en `governance-log.md` / Linked proposal and vote in `governance-log.md`  
- **Auditoría / Audit:** Validación en `contracts-audit.md` / Validation in `contracts-audit.md`  
- **Notas / Notes:** Observaciones relevantes / Relevant observations  
- **Enlaces / Links:** URLs a transacciones en PolygonScan, repositorio o documentos legales / URLs to PolygonScan transactions, repository, or legal documents  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Fecha / Date:** 2026-03-01  
- **Tipo de Contrato / Contract Type:** Smart Contract  
- **Nombre / Descripción / Name / Description:** DOA Token ERC-20 (versión inicial / initial version)  
- **Dirección / Address:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Motivo de Terminación / Termination Reason:** Migración a nueva versión con mejoras de seguridad y gobernanza / Migration to new version with security and governance improvements  
- **Estado / Status:** migrated  
- **Vinculación Gobernanza / Governance Link:** Propuesta P-003 – Aprobada por comunidad / Proposal P-003 – Approved by community  
- **Auditoría / Audit:** CertiK – validación de migración sin hallazgos críticos / migration validation with no critical findings  
- **Notas / Notes:** Contrato inicial desactivado, nueva versión registrada en `contracts-log.md`. / Initial contract deactivated, new version recorded in `contracts-log.md`.  
- **Enlaces / Links:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## 📌 Notas / Notes
- Cada terminación o migración debe registrarse inmediatamente después de completarse.  
- Each termination or migration must be recorded immediately after completion.  

- Este archivo complementa `contracts-log.md`, `contracts-audit.md`, `contracts-ownership.md` y `contracts-governance.md`.  
- This file complements `contracts-log.md`, `contracts-audit.md`, `contracts-ownership.md`, and `contracts-governance.md`.  

- La trazabilidad en terminaciones fortalece la confianza de la comunidad y exchanges.  
- Traceability in terminations strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
