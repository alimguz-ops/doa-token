---
layout: default
title: contracts-migration
---

# 🔄 DOA Token – Contracts Migration Register  
# 🔄 DOA Token – Registro de Migración de Contratos

Este documento describe y registra los procesos de migración de contratos inteligentes del DOA Token hacia nuevas versiones o arquitecturas.  
Su objetivo es garantizar trazabilidad, transparencia y reproducibilidad en cada migración.  
This document describes and records the migration processes of DOA Token smart contracts to new versions or architectures.  
Its purpose is to ensure traceability, transparency, and reproducibility in each migration.  

---

## 📑 Principios de Migración / Migration Principles

1. **Transparencia / Transparency:** Cada migración debe estar vinculada a una propuesta y votación en `governance-log.md`.  
2. **Seguridad / Security:** La migración debe ser auditada y documentada en `contracts-audit.md`.  
3. **Reproducibilidad / Reproducibility:** Los pasos de migración deben estar claramente definidos y replicables.  
4. **Comunicación / Communication:** Los resultados deben publicarse en `announcement.md` y registrarse en `contracts-log.md`.  

---

## 📋 Flujo de Migración / Migration Flow

1. **Propuesta de Migración / Migration Proposal:**  
   - Creación en `proposals.md`.  
   - Publicación en `announcement.md`.  

2. **Votación Comunitaria / Community Voting:**  
   - Registro en `governance-log.md`.  
   - Estado final: `approved` o `rejected`.  

3. **Deploy del Nuevo Contrato / New Contract Deployment:**  
   - Documentar en `contracts-deploy.md`.  
   - Registrar dirección en `contracts.md`.  

4. **Transferencia de Propiedad y Datos / Ownership & Data Transfer:**  
   - Registro en `contracts-transfer.md`.  
   - Validación en `contracts-ownership.md`.  

5. **Auditoría de Migración / Migration Audit:**  
   - Validación en `contracts-audit.md`.  
   - Registro en `audit-log.md`.  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Fecha / Date:** 2026-03-01  
- **Contrato Migrado / Migrated Contract:** DOA Token ERC-20 (versión inicial / initial version)  
- **Nuevo Contrato / New Contract:** DOA Token ERC-20 v2  
- **Motivo / Reason:** Mejoras de seguridad y gobernanza / Security and governance improvements  
- **Estado / Status:** completed  
- **Propuesta / Proposal:** P-003 – Aprobada por comunidad / Approved by community  
- **Auditoría / Audit:** CertiK – validación sin hallazgos críticos / validation with no critical findings  
- **Notas / Notes:** Migración ejecutada exitosamente, contrato inicial marcado como `deprecated`. / Migration executed successfully, initial contract marked as `deprecated`.  
- **Enlaces / Links:**  
  - `contracts-log.md`  
  - `contracts-deploy.md`  
  - `contracts-transfer.md`  
  - `contracts-audit.md`  

---

## 📌 Notas / Notes
- Cada migración debe registrarse inmediatamente después de completarse.  
- Each migration must be recorded immediately after completion.  

- Este archivo complementa `contracts-deploy.md`, `contracts-transfer.md`, `contracts-ownership.md` y `contracts-termination.md`.  
- This file complements `contracts-deploy.md`, `contracts-transfer.md`, `contracts-ownership.md`, and `contracts-termination.md`.  

- La trazabilidad en migraciones fortalece la confianza de la comunidad y exchanges.  
- Traceability in migrations strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
