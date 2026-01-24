# DOA Token – Contracts Versioning Register

Este documento define el control de versiones y cambios técnicos aplicados a cada contrato inteligente del DOA Token.  
Su objetivo es garantizar trazabilidad, reproducibilidad y transparencia en la evolución de los contratos.

---

## 🛠 Principios de Versionado

1. **Transparencia:** Cada versión debe estar documentada en este registro y vinculada a `contracts-log.md`.  
2. **Reproducibilidad:** Los cambios deben ser claros, auditables y replicables en cualquier entorno.  
3. **Gobernanza:** Toda actualización debe estar vinculada a propuestas y votaciones en `governance-log.md`.  
4. **Auditoría:** Cada versión debe ser validada en `contracts-audit.md`.  

---

## 📋 Formato de Registro

- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **Versión:** v1 | v2 | v3 | etc.  
- **Fecha de Publicación:** YYYY-MM-DD  
- **Cambios Principales:** Breve descripción de las modificaciones  
- **Motivo:** Razón de la actualización (ej. optimización, seguridad, gobernanza)  
- **Estado:** `active` | `deprecated` | `migrated`  
- **Gobernanza:** Propuesta y votación vinculada en `governance-log.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Versión:** v1  
- **Fecha de Publicación:** 2025-12-20  
- **Cambios Principales:** Deploy inicial con funciones básicas (`transfer`, `burn`, `mint`).  
- **Motivo:** Lanzamiento oficial del token.  
- **Estado:** deprecated (migrado a v2).  
- **Gobernanza:** Propuesta P-003 – Aprobada por comunidad.  
- **Auditoría:** CertiK – issues-found (optimización de gas).  
- **Notas:** Versión inicial reemplazada por v2 con mejoras de seguridad.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-audit.md`  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  

---

## 📌 Notas

- Este archivo complementa `contracts-roadmap.md`, `contracts-migration.md`, `contracts-audit.md` y `contracts-log.md`.  
- Debe actualizarse cada vez que se publique una nueva versión de contrato.  
- La trazabilidad en versionado fortalece la confianza de la comunidad y exchanges.