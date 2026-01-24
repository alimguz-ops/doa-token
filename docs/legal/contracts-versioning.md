# DOA Token â€“ Contracts Versioning Register

Este documento define el control de versiones y cambios tÃ©cnicos aplicados a cada contrato inteligente del DOA Token.  
Su objetivo es garantizar trazabilidad, reproducibilidad y transparencia en la evoluciÃ³n de los contratos.

---

## ðŸ›  Principios de Versionado

1. **Transparencia:** Cada versiÃ³n debe estar documentada en este registro y vinculada a `contracts-log.md`.  
2. **Reproducibilidad:** Los cambios deben ser claros, auditables y replicables en cualquier entorno.  
3. **Gobernanza:** Toda actualizaciÃ³n debe estar vinculada a propuestas y votaciones en `governance-log.md`.  
4. **AuditorÃ­a:** Cada versiÃ³n debe ser validada en `contracts-audit.md`.  

---

## ðŸ“‹ Formato de Registro

- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **VersiÃ³n:** v1 | v2 | v3 | etc.  
- **Fecha de PublicaciÃ³n:** YYYY-MM-DD  
- **Cambios Principales:** Breve descripciÃ³n de las modificaciones  
- **Motivo:** RazÃ³n de la actualizaciÃ³n (ej. optimizaciÃ³n, seguridad, gobernanza)  
- **Estado:** `active` | `deprecated` | `migrated`  
- **Gobernanza:** Propuesta y votaciÃ³n vinculada en `governance-log.md`  
- **AuditorÃ­a:** ValidaciÃ³n en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **VersiÃ³n:** v1  
- **Fecha de PublicaciÃ³n:** 2025-12-20  
- **Cambios Principales:** Deploy inicial con funciones bÃ¡sicas (`transfer`, `burn`, `mint`).  
- **Motivo:** Lanzamiento oficial del token.  
- **Estado:** deprecated (migrado a v2).  
- **Gobernanza:** Propuesta P-003 â€“ Aprobada por comunidad.  
- **AuditorÃ­a:** CertiK â€“ issues-found (optimizaciÃ³n de gas).  
- **Notas:** VersiÃ³n inicial reemplazada por v2 con mejoras de seguridad.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-audit.md`  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  

---

## ðŸ“Œ Notas

- Este archivo complementa `contracts-roadmap.md`, `contracts-migration.md`, `contracts-audit.md` y `contracts-log.md`.  
- Debe actualizarse cada vez que se publique una nueva versiÃ³n de contrato.  
- La trazabilidad en versionado fortalece la confianza de la comunidad y exchanges.
