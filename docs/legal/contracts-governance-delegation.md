# DOA Token â€“ Contracts Governance Delegation

Este documento describe cÃ³mo se delegan funciones y responsabilidades sobre contratos inteligentes y legales del DOA Token dentro del sistema de gobernanza.  
Su objetivo es garantizar transparencia, trazabilidad y legitimidad en la gestiÃ³n descentralizada de contratos.

---

## ðŸ› Principios de DelegaciÃ³n

1. **Transparencia:** Toda delegaciÃ³n debe estar registrada en `governance-log.md`.  
2. **Legitimidad:** La delegaciÃ³n solo puede realizarse mediante propuestas comunitarias aprobadas.  
3. **Responsabilidad:** Los delegados deben rendir cuentas a la comunidad y auditores.  
4. **Seguridad:** Funciones crÃ­ticas deben delegarse Ãºnicamente a entidades verificadas (ej. multisig, auditores externos).  
5. **Trazabilidad:** Cada delegaciÃ³n debe reflejarse en `contracts-ownership.md` y `contracts-transfer.md`.  

---

## ðŸ“‹ Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato Afectado:** Nombre y direcciÃ³n del contrato  
- **FunciÃ³n Delegada:** Ej. administraciÃ³n de liquidez, actualizaciÃ³n de parÃ¡metros, auditorÃ­a tÃ©cnica  
- **Delegado:** DirecciÃ³n de wallet, entidad o rol asignado  
- **Motivo de DelegaciÃ³n:** Breve explicaciÃ³n (ej. descentralizaciÃ³n, seguridad, eficiencia)  
- **DuraciÃ³n:** Permanente | Temporal (con fecha de expiraciÃ³n)  
- **Gobernanza:** Propuesta y votaciÃ³n vinculada en `governance-log.md`  
- **AuditorÃ­a:** ValidaciÃ³n en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a transacciones en PolygonScan, repositorio o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Fecha:** 2026-01-22  
- **Contrato Afectado:** DOA Token ERC-20 â€“ `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **FunciÃ³n Delegada:** AdministraciÃ³n de liquidez en pool USDC/DOA  
- **Delegado:** Multisig comunitario `0x456...def`  
- **Motivo de DelegaciÃ³n:** Fortalecer descentralizaciÃ³n y seguridad en gestiÃ³n de liquidez.  
- **DuraciÃ³n:** Permanente  
- **Gobernanza:** Propuesta P-005 â€“ Aprobada por comunidad.  
- **AuditorÃ­a:** CertiK â€“ validaciÃ³n sin hallazgos crÃ­ticos.  
- **Notas:** DelegaciÃ³n ejecutada exitosamente, registrada en `contracts-transfer.md`.  
- **Enlaces:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-ownership.md`  
  - `contracts-transfer.md`  

---

## ðŸ“Œ Notas

- Cada delegaciÃ³n debe registrarse inmediatamente despuÃ©s de completarse.  
- Este archivo complementa `contracts-governance.md`, `contracts-governance-log.md`, `contracts-ownership.md` y `contracts-transfer.md`.  
- La trazabilidad en delegaciones fortalece la confianza de la comunidad y exchanges.
