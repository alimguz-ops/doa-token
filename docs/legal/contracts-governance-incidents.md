---
layout: default
title: contracts-governance-incidents
---

# ⚠️ DOA Token – Contracts Governance Incidents  
# ⚠️ DOA Token – Incidentes de Gobernanza de Contratos

Este documento registra incidentes técnicos, legales o comunitarios que afectan contratos bajo gobernanza del DOA Token.  
Su objetivo es garantizar transparencia, trazabilidad y seguridad en la gestión de eventos inesperados o adversos.  
This document records technical, legal, or community incidents affecting contracts under DOA Token governance.  
Its purpose is to ensure transparency, traceability, and security in managing unexpected or adverse events.  

---

## 🏛 Principios de Registro de Incidentes / Incident Recording Principles

1. **Transparencia / Transparency:** Cada incidente debe estar documentado y accesible a la comunidad.  
2. **Legitimidad / Legitimacy:** Los registros deben basarse en hechos verificables y decisiones comunitarias posteriores.  
3. **Seguridad / Security:** Ningún incidente puede comprometer la integridad técnica o legal sin medidas de mitigación.  
4. **Trazabilidad / Traceability:** Cada incidente debe reflejarse en `contracts-risk.md`, `contracts-governance-decision.md` y `contracts-changelog.md`.  
5. **Prevención / Prevention:** Los incidentes deben servir como base para mejorar procesos y fortalecer la gobernanza.  

---

## 📚 Formato de Registro / Log Format

- **Fecha / Date:** YYYY-MM-DD  
- **ID del Incidente / Incident ID:** INC-XXX (ej. INC-001)  
- **Contrato Afectado / Affected Contract:** Nombre y dirección del contrato / Contract name and address  
- **Descripción del Incidente / Incident Description:** Breve explicación del evento adverso / Brief explanation of the adverse event  
- **Tipo de Incidente / Incident Type:** técnico | legal | comunitario | operativo / technical | legal | community | operational  
- **Impacto / Impact:** bajo | medio | alto | crítico / low | medium | high | critical  
- **Estado / Status:** `open` | `resolved` | `mitigated` | `pending`  
- **Acciones Tomadas / Actions Taken:** Registro en `contracts-governance-decision.md`, `contracts-migration.md` o `contracts-transfer.md`  
- **Notas / Notes:** Observaciones relevantes / Relevant observations  
- **Enlaces / Links:** URLs a auditorías, transacciones en PolygonScan o documentos legales / URLs to audits, PolygonScan transactions, or legal documents  

---

## 📑 Ejemplo de Entrada / Example Entry

- **Fecha / Date:** 2026-07-10  
- **ID del Incidente / Incident ID:** INC-002  
- **Contrato Afectado / Affected Contract:** Liquidity Pool – `0xDEF...456`  
- **Descripción del Incidente / Incident Description:** Error en parámetros de liquidez que generó inestabilidad temporal en el pool. / Error in liquidity parameters that caused temporary instability in the pool.  
- **Tipo de Incidente / Incident Type:** técnico / technical  
- **Impacto / Impact:** medio / medium  
- **Estado / Status:** resolved  
- **Acciones Tomadas / Actions Taken:** Ajuste de parámetros documentado en `contracts-governance-decision.md` y `contracts-changelog.md`. / Parameter adjustment documented in `contracts-governance-decision.md` and `contracts-changelog.md`.  
- **Notas / Notes:** El incidente fortaleció la necesidad de auditorías preventivas. / The incident reinforced the need for preventive audits.  
- **Enlaces / Links:**  
  - `contracts-risk.md`  
  - `contracts-audit.md`  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  

---

## 📌 Notas / Notes
- Cada incidente debe registrarse inmediatamente después de ser detectado.  
- Each incident must be recorded immediately after being detected.  

- Este archivo complementa `contracts-risk.md`, `contracts-governance-decision.md`, `contracts-audit.md` y `contracts-changelog.md`.  
- This file complements `contracts-risk.md`, `contracts-governance-decision.md`, `contracts-audit.md`, and `contracts-changelog.md`.  

- La trazabilidad en incidentes fortalece la confianza de la comunidad y exchanges.  
- Traceability in incidents strengthens community and exchange trust.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
