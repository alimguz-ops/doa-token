---
layout: default
title: contracts-transfer
---

# 🔐 DOA Token – Contracts Transfer Log  
# 🔐 DOA Token – Registro de Transferencias de Contratos

Este documento registra todas las transferencias de propiedad y permisos realizadas sobre los contratos inteligentes del DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.  
This document records all ownership and permission transfers carried out on DOA Token smart contracts.  
Its purpose is to ensure traceability, transparency, and trust for auditors, the community, and exchanges.  

---

## 📋 Formato de Registro / Log Format

- **Fecha / Date:** YYYY-MM-DD  
- **Contrato / Contract:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance) / Contract name (e.g., ERC-20 Token, Liquidity Pool, Governance)  
- **Dirección / Address:** Dirección en blockchain del contrato / Contract blockchain address  
- **Propietario Anterior / Previous Owner:** Dirección del wallet o entidad previa / Previous wallet or entity address  
- **Nuevo Propietario / New Owner:** Dirección del wallet o entidad actual / Current wallet or entity address  
- **Motivo de Transferencia / Transfer Reason:** Breve descripción (ej. migración a multisig, decisión de gobernanza) / Brief description (e.g., migration to multisig, governance decision)  
- **Estado / Status:** `completed` | `pending` | `rejected`  
- **Vinculación Gobernanza / Governance Link:** Propuesta y votación registrada en `governance-log.md` / Linked proposal and vote in `governance-log.md`  
- **Auditoría / Audit:** Validación en `contracts-audit.md` / Validation in `contracts-audit.md`  
- **Notas / Notes:** Observaciones relevantes / Relevant observations  
- **Enlaces / Links:** URLs a transacciones en PolygonScan, repositorio o documentos legales / URLs to PolygonScan transactions, repository, or legal documents  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Fecha / Date:** 2026-01-22  
- **Contrato / Contract:** DOA Token ERC-20  
- **Dirección / Address:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Propietario Anterior / Previous Owner:** `0x123...abc`  
- **Nuevo Propietario / New Owner:** Multisig comunitario `0x456...def` / Community multisig `0x456...def`  
- **Motivo de Transferencia / Transfer Reason:** Votación P-002 – Transferencia de propiedad a gobernanza comunitaria / Proposal P-002 – Ownership transfer to community governance  
- **Estado / Status:** completed  
- **Vinculación Gobernanza / Governance Link:** `governance-log.md` – Propuesta P-002 aprobada / Proposal P-002 approved  
- **Auditoría / Audit:** CertiK – validación sin hallazgos críticos / validation with no critical findings  
- **Notas / Notes:** Transferencia ejecutada exitosamente, fortaleciendo descentralización. / Transfer executed successfully, strengthening decentralization.  
- **Enlaces / Links:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## 📌 Notas / Notes
- Cada transferencia debe registrarse inmediatamente después de completarse.  
- Each transfer must be recorded immediately after completion.  

- Este archivo complementa `contracts-ownership.md`, `contracts-log.md`, `contracts-audit.md` y `governance-log.md`.  
- This file complements `contracts-ownership.md`, `contracts-log.md`, `contracts-audit.md`, and `governance-log.md`.  

- La trazabilidad en transferencias fortalece la confianza de la comunidad y exchanges.  
- Traceability in transfers strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
