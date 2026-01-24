# DOA Token â€“ Contracts Changelog

Este documento registra cronolÃ³gicamente todos los cambios tÃ©cnicos y legales aplicados a los contratos del DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## ðŸ“‹ Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **VersiÃ³n / Estado:** v1 | v2 | v3 | deprecated | migrated  
- **Tipo de Cambio:** TÃ©cnico | Legal | Gobernanza | Seguridad  
- **DescripciÃ³n del Cambio:** Breve explicaciÃ³n del ajuste realizado  
- **Motivo:** RazÃ³n del cambio (ej. optimizaciÃ³n, migraciÃ³n, cumplimiento regulatorio)  
- **Gobernanza:** Propuesta y votaciÃ³n vinculada en `governance-log.md`  
- **AuditorÃ­a:** ValidaciÃ³n en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Fecha:** 2025-12-20  
- **Contrato:** DOA Token ERC-20  
- **VersiÃ³n / Estado:** v1  
- **Tipo de Cambio:** TÃ©cnico  
- **DescripciÃ³n del Cambio:** Deploy inicial con funciones bÃ¡sicas (`transfer`, `burn`, `mint`).  
- **Motivo:** Lanzamiento oficial del token.  
- **Gobernanza:** Propuesta P-001 â€“ Aprobada por comunidad.  
- **AuditorÃ­a:** CertiK â€“ issues-found (optimizaciÃ³n de gas).  
- **Notas:** VersiÃ³n inicial marcada como `deprecated` tras migraciÃ³n a v2.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-versioning.md`  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  

---

- **Fecha:** 2026-03-01  
- **Contrato:** DOA Token ERC-20  
- **VersiÃ³n / Estado:** v2  
- **Tipo de Cambio:** TÃ©cnico + Gobernanza  
- **DescripciÃ³n del Cambio:** MigraciÃ³n a nueva versiÃ³n con optimizaciÃ³n de gas y funciones de gobernanza integradas.  
- **Motivo:** ReducciÃ³n de costos de transacciÃ³n y descentralizaciÃ³n.  
- **Gobernanza:** Propuesta P-003 â€“ Aprobada por comunidad.  
- **AuditorÃ­a:** CertiK â€“ validaciÃ³n sin hallazgos crÃ­ticos.  
- **Notas:** Contrato v2 activo y auditado, reemplazando v1.  
- **Enlaces:**  
  - `contracts-migration.md`  
  - `contracts-audit.md`  
  - `contracts-roadmap.md`  

---

## ðŸ“Œ Notas

- Cada cambio debe registrarse inmediatamente despuÃ©s de completarse.  
- Este archivo complementa `contracts-versioning.md`, `contracts-migration.md`, `contracts-audit.md` y `contracts-roadmap.md`.  
- La trazabilidad en cambios fortalece la confianza de la comunidad y exchanges.
