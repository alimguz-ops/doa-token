# DOA Token – Contracts Changelog

Este documento registra cronológicamente todos los cambios técnicos y legales aplicados a los contratos del DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **Versión / Estado:** v1 | v2 | v3 | deprecated | migrated  
- **Tipo de Cambio:** Técnico | Legal | Gobernanza | Seguridad  
- **Descripción del Cambio:** Breve explicación del ajuste realizado  
- **Motivo:** Razón del cambio (ej. optimización, migración, cumplimiento regulatorio)  
- **Gobernanza:** Propuesta y votación vinculada en `governance-log.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2025-12-20  
- **Contrato:** DOA Token ERC-20  
- **Versión / Estado:** v1  
- **Tipo de Cambio:** Técnico  
- **Descripción del Cambio:** Deploy inicial con funciones básicas (`transfer`, `burn`, `mint`).  
- **Motivo:** Lanzamiento oficial del token.  
- **Gobernanza:** Propuesta P-001 – Aprobada por comunidad.  
- **Auditoría:** CertiK – issues-found (optimización de gas).  
- **Notas:** Versión inicial marcada como `deprecated` tras migración a v2.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-versioning.md`  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  

---

- **Fecha:** 2026-03-01  
- **Contrato:** DOA Token ERC-20  
- **Versión / Estado:** v2  
- **Tipo de Cambio:** Técnico + Gobernanza  
- **Descripción del Cambio:** Migración a nueva versión con optimización de gas y funciones de gobernanza integradas.  
- **Motivo:** Reducción de costos de transacción y descentralización.  
- **Gobernanza:** Propuesta P-003 – Aprobada por comunidad.  
- **Auditoría:** CertiK – validación sin hallazgos críticos.  
- **Notas:** Contrato v2 activo y auditado, reemplazando v1.  
- **Enlaces:**  
  - `contracts-migration.md`  
  - `contracts-audit.md`  
  - `contracts-roadmap.md`  

---

## 📌 Notas

- Cada cambio debe registrarse inmediatamente después de completarse.  
- Este archivo complementa `contracts-versioning.md`, `contracts-migration.md`, `contracts-audit.md` y `contracts-roadmap.md`.  
- La trazabilidad en cambios fortalece la confianza de la comunidad y exchanges.