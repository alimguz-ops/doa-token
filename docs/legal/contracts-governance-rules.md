# DOA Token – Contracts Governance Rules

Este documento define las reglas y principios que rigen cómo la gobernanza comunitaria puede modificar, actualizar o finalizar contratos inteligentes y legales del DOA Token.  
Su objetivo es garantizar transparencia, legitimidad y trazabilidad en todas las decisiones que afectan contratos.

---

## 🏛 Principios de Gobernanza sobre Contratos

1. **Legitimidad:** Ningún cambio en contratos puede realizarse sin aprobación comunitaria registrada en `governance-log.md`.  
2. **Transparencia:** Todas las propuestas deben publicarse en `proposals.md` y comunicarse en `announcement.md`.  
3. **Auditoría:** Cada modificación debe ser validada en `contracts-audit.md`.  
4. **Seguridad:** Cambios críticos deben estar respaldados por auditorías externas y validaciones técnicas.  
5. **Trazabilidad:** Cada decisión debe reflejarse en `contracts-log.md`, `contracts-versioning.md` y `contracts-changelog.md`.  

---

## 📋 Reglas de Gobernanza

- **Propuestas:**  
  - Todo cambio debe originarse en una propuesta comunitaria (`proposals.md`).  
  - La propuesta debe incluir descripción, contrato afectado y justificación.  

- **Votaciones:**  
  - Las votaciones deben registrarse en `governance-log.md`.  
  - Estado final: `approved` | `rejected` | `pending`.  

- **Implementación:**  
  - Cambios técnicos → documentados en `contracts-deploy.md` o `contracts-migration.md`.  
  - Cambios de propiedad → registrados en `contracts-transfer.md` y `contracts-ownership.md`.  
  - Terminaciones → documentadas en `contracts-termination.md`.  

- **Auditoría:**  
  - Cada cambio debe ser validado en `contracts-audit.md`.  
  - Hallazgos deben registrarse en `contracts-risk.md` y `contracts-incidents.md`.  

- **Comunicación:**  
  - Resultados publicados en `announcement.md`.  
  - Actualización en `contracts-changelog.md` y `contracts-roadmap.md`.  

---

## 📒 Ejemplo de Entrada

- **Propuesta:** P-004 – Ajuste en función `burn`  
- **Contrato Afectado:** DOA Token ERC-20 – `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Regla Aplicada:**  
  - Propuesta creada en `proposals.md`.  
  - Votación registrada en `governance-log.md` → resultado: approved.  
  - Implementación en `contracts-deploy.md` (versión v2).  
  - Auditoría externa en `contracts-audit.md`.  
  - Comunicación en `announcement.md`.  
- **Notas:** Cambio ejecutado conforme a reglas de gobernanza, fortaleciendo descentralización.  

---

## 📌 Notas

- Este archivo complementa `contracts-governance.md`, `contracts-governance-log.md`, `contracts-audit.md` y `contracts-changelog.md`.  
- Debe actualizarse cada vez que se apruebe una nueva regla o se aplique un cambio en contratos.  
- La trazabilidad en reglas fortalece la confianza de la comunidad y exchanges.