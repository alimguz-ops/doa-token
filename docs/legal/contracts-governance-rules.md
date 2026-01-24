# DOA Token â€“ Contracts Governance Rules

Este documento define las reglas y principios que rigen cÃ³mo la gobernanza comunitaria puede modificar, actualizar o finalizar contratos inteligentes y legales del DOA Token.  
Su objetivo es garantizar transparencia, legitimidad y trazabilidad en todas las decisiones que afectan contratos.

---

## ðŸ› Principios de Gobernanza sobre Contratos

1. **Legitimidad:** NingÃºn cambio en contratos puede realizarse sin aprobaciÃ³n comunitaria registrada en `governance-log.md`.  
2. **Transparencia:** Todas las propuestas deben publicarse en `proposals.md` y comunicarse en `announcement.md`.  
3. **AuditorÃ­a:** Cada modificaciÃ³n debe ser validada en `contracts-audit.md`.  
4. **Seguridad:** Cambios crÃ­ticos deben estar respaldados por auditorÃ­as externas y validaciones tÃ©cnicas.  
5. **Trazabilidad:** Cada decisiÃ³n debe reflejarse en `contracts-log.md`, `contracts-versioning.md` y `contracts-changelog.md`.  

---

## ðŸ“‹ Reglas de Gobernanza

- **Propuestas:**  
  - Todo cambio debe originarse en una propuesta comunitaria (`proposals.md`).  
  - La propuesta debe incluir descripciÃ³n, contrato afectado y justificaciÃ³n.  

- **Votaciones:**  
  - Las votaciones deben registrarse en `governance-log.md`.  
  - Estado final: `approved` | `rejected` | `pending`.  

- **ImplementaciÃ³n:**  
  - Cambios tÃ©cnicos â†’ documentados en `contracts-deploy.md` o `contracts-migration.md`.  
  - Cambios de propiedad â†’ registrados en `contracts-transfer.md` y `contracts-ownership.md`.  
  - Terminaciones â†’ documentadas en `contracts-termination.md`.  

- **AuditorÃ­a:**  
  - Cada cambio debe ser validado en `contracts-audit.md`.  
  - Hallazgos deben registrarse en `contracts-risk.md` y `contracts-incidents.md`.  

- **ComunicaciÃ³n:**  
  - Resultados publicados en `announcement.md`.  
  - ActualizaciÃ³n en `contracts-changelog.md` y `contracts-roadmap.md`.  

---

## ðŸ“’ Ejemplo de Entrada

- **Propuesta:** P-004 â€“ Ajuste en funciÃ³n `burn`  
- **Contrato Afectado:** DOA Token ERC-20 â€“ `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Regla Aplicada:**  
  - Propuesta creada en `proposals.md`.  
  - VotaciÃ³n registrada en `governance-log.md` â†’ resultado: approved.  
  - ImplementaciÃ³n en `contracts-deploy.md` (versiÃ³n v2).  
  - AuditorÃ­a externa en `contracts-audit.md`.  
  - ComunicaciÃ³n en `announcement.md`.  
- **Notas:** Cambio ejecutado conforme a reglas de gobernanza, fortaleciendo descentralizaciÃ³n.  

---

## ðŸ“Œ Notas

- Este archivo complementa `contracts-governance.md`, `contracts-governance-log.md`, `contracts-audit.md` y `contracts-changelog.md`.  
- Debe actualizarse cada vez que se apruebe una nueva regla o se aplique un cambio en contratos.  
- La trazabilidad en reglas fortalece la confianza de la comunidad y exchanges.
