---
layout: default
title: contracts-ownership
---

# 🔐 DOA Token – Contracts Ownership & Permissions  
# 🔐 DOA Token – Propiedad y Permisos de Contratos

Este documento define la gestión de propiedad, permisos y roles asociados a cada contrato inteligente del DOA Token.  
Su objetivo es garantizar transparencia, seguridad y trazabilidad en la administración de contratos.  
This document defines the management of ownership, permissions, and roles associated with each DOA Token smart contract.  
Its purpose is to ensure transparency, security, and traceability in contract administration.  

---

## 🏛 Principios de Propiedad / Ownership Principles

1. **Transparencia / Transparency:** La propiedad de cada contrato debe estar documentada y verificable en blockchain. / Ownership of each contract must be documented and verifiable on blockchain.  
2. **Seguridad / Security:** Los permisos deben limitarse estrictamente a funciones necesarias. / Permissions must be strictly limited to necessary functions.  
3. **Responsabilidad / Responsibility:** Los cambios de propiedad o permisos deben registrarse en `contracts-log.md`. / Ownership or permission changes must be recorded in `contracts-log.md`.  
4. **Gobernanza / Governance:** Toda modificación debe estar vinculada a propuestas y votaciones en `governance-log.md`. / All modifications must be linked to proposals and votes in `governance-log.md`.  

---

## 📋 Roles y Permisos / Roles and Permissions

- **Owner (Propietario):**  
  - Control inicial del contrato. / Initial control of the contract.  
  - Puede transferir propiedad a la gobernanza comunitaria. / Can transfer ownership to community governance.  
  - Documentado en `contracts.md`. / Documented in `contracts.md`.  

- **Admin (Administrador):**  
  - Gestiona parámetros operativos (ej. supply, quema, liquidez). / Manages operational parameters (e.g., supply, burn, liquidity).  
  - Limitado por votaciones en `governance.md`. / Limited by votes in `governance.md`.  

- **Community (Comunidad):**  
  - Participa en votaciones que afectan permisos y funciones críticas. / Participates in votes affecting permissions and critical functions.  
  - Registro en `governance-log.md`. / Recorded in `governance-log.md`.  

- **Auditors (Auditores):**  
  - Validan que los permisos coincidan con lo aprobado. / Validate that permissions match what was approved.  
  - Documentan hallazgos en `contracts-audit.md`. / Document findings in `contracts-audit.md`.  

---

## 📋 Procedimientos de Gestión / Management Procedures

1. **Asignación de Propiedad / Ownership Assignment:**  
   - Registrar dirección del Owner en `contracts.md`. / Record Owner address in `contracts.md`.  
   - Confirmar en PolygonScan. / Confirm on PolygonScan.  

2. **Transferencia de Propiedad / Ownership Transfer:**  
   - Propuesta en `proposals.md`. / Proposal in `proposals.md`.  
   - Votación en `governance-log.md`. / Voting in `governance-log.md`.  
   - Registro en `contracts-log.md`. / Record in `contracts-log.md`.  

3. **Actualización de Permisos / Permissions Update:**  
   - Validación técnica en `contracts-audit.md`. / Technical validation in `contracts-audit.md`.  
   - Publicación en `announcement.md`. / Publication in `announcement.md`.  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Contrato / Contract:** DOA Token ERC-20  
- **Owner:** Dirección `0x123...abc`  
- **Admin:** Dirección `0x456...def`  
- **Community:** Gobernanza activa vía Snapshot / Active governance via Snapshot  
- **Auditors:** CertiK – validación 2025-12-20 / validation 2025-12-20  
- **Notas / Notes:** Propiedad transferida a multisig comunitario tras votación P-002. / Ownership transferred to community multisig after Proposal P-002 vote.  

---

## 📌 Notas / Notes
- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y `contracts-governance.md`.  
- This file complements `contracts.md`, `contracts-log.md`, `contracts-audit.md`, and `contracts-governance.md`.  

- Debe actualizarse cada vez que se modifique la propiedad o permisos de un contrato.  
- It must be updated each time ownership or permissions of a contract are modified.  

- La trazabilidad en propiedad fortalece la confianza de la comunidad y exchanges.  
- Traceability in ownership strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
