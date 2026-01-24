# DOA Token â€“ Contracts Incidents Register

Este documento registra incidentes, fallos o vulnerabilidades detectados en contratos inteligentes y legales del DOA Token, junto con sus resoluciones.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## ðŸ›¡ Principios de Registro de Incidentes

1. **Transparencia:** Todo incidente debe documentarse inmediatamente despuÃ©s de ser detectado.  
2. **Responsabilidad:** Cada incidente debe vincularse a acciones correctivas y auditorÃ­as.  
3. **Gobernanza:** Las resoluciones deben estar alineadas con decisiones comunitarias registradas en `governance-log.md`.  
4. **PrevenciÃ³n:** Los incidentes deben alimentar el registro de riesgos en `contracts-risk.md`.  

---

## ðŸ“‹ Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **DirecciÃ³n / UbicaciÃ³n:** DirecciÃ³n en blockchain o ruta de archivo legal  
- **Tipo de Incidente:** TÃ©cnico | Legal | Operacional | Gobernanza  
- **DescripciÃ³n:** Breve explicaciÃ³n del incidente detectado  
- **Impacto:** `alto` | `medio` | `bajo`  
- **Acciones Correctivas:** Medidas aplicadas para resolver el incidente  
- **Estado:** `open` | `resolved` | `mitigated`  
- **Gobernanza:** Propuesta y votaciÃ³n vinculada en `governance-log.md`  
- **AuditorÃ­a:** ValidaciÃ³n en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a reportes, transacciones o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Fecha:** 2026-02-10  
- **Contrato:** DOA Token ERC-20  
- **DirecciÃ³n / UbicaciÃ³n:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Tipo de Incidente:** TÃ©cnico  
- **DescripciÃ³n:** Error en la funciÃ³n `burn` que permitÃ­a quemar mÃ¡s tokens de los disponibles.  
- **Impacto:** alto  
- **Acciones Correctivas:**  
  - Hotfix aplicado en contrato v1.  
  - MigraciÃ³n a contrato v2 documentada en `contracts-migration.md`.  
- **Estado:** resolved  
- **Gobernanza:** Propuesta P-004 â€“ Aprobada por comunidad.  
- **AuditorÃ­a:** CertiK â€“ validaciÃ³n sin hallazgos crÃ­ticos tras correcciÃ³n.  
- **Notas:** El incidente reforzÃ³ la necesidad de auditorÃ­as preventivas.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-risk.md`  
  - `contracts-migration.md`  

---

## ðŸ“Œ Notas

- Cada incidente debe registrarse inmediatamente despuÃ©s de ser detectado.  
- Este archivo complementa `contracts-risk.md`, `contracts-audit.md`, `contracts-log.md` y `security-incidents.md`.  
- La trazabilidad en incidentes fortalece la confianza de la comunidad y exchanges.
