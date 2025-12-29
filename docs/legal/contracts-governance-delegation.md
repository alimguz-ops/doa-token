# DOA Token – Contracts Governance Delegation

Este documento describe cómo se delegan funciones y responsabilidades sobre contratos inteligentes y legales del DOA Token dentro del sistema de gobernanza.  
Su objetivo es garantizar transparencia, trazabilidad y legitimidad en la gestión descentralizada de contratos.

---

## 🏛 Principios de Delegación

1. **Transparencia:** Toda delegación debe estar registrada en `governance-log.md`.  
2. **Legitimidad:** La delegación solo puede realizarse mediante propuestas comunitarias aprobadas.  
3. **Responsabilidad:** Los delegados deben rendir cuentas a la comunidad y auditores.  
4. **Seguridad:** Funciones críticas deben delegarse únicamente a entidades verificadas (ej. multisig, auditores externos).  
5. **Trazabilidad:** Cada delegación debe reflejarse en `contracts-ownership.md` y `contracts-transfer.md`.  

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato Afectado:** Nombre y dirección del contrato  
- **Función Delegada:** Ej. administración de liquidez, actualización de parámetros, auditoría técnica  
- **Delegado:** Dirección de wallet, entidad o rol asignado  
- **Motivo de Delegación:** Breve explicación (ej. descentralización, seguridad, eficiencia)  
- **Duración:** Permanente | Temporal (con fecha de expiración)  
- **Gobernanza:** Propuesta y votación vinculada en `governance-log.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a transacciones en PolygonScan, repositorio o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-01-22  
- **Contrato Afectado:** DOA Token ERC-20 – `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Función Delegada:** Administración de liquidez en pool USDC/DOA  
- **Delegado:** Multisig comunitario `0x456...def`  
- **Motivo de Delegación:** Fortalecer descentralización y seguridad en gestión de liquidez.  
- **Duración:** Permanente  
- **Gobernanza:** Propuesta P-005 – Aprobada por comunidad.  
- **Auditoría:** CertiK – validación sin hallazgos críticos.  
- **Notas:** Delegación ejecutada exitosamente, registrada en `contracts-transfer.md`.  
- **Enlaces:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-ownership.md`  
  - `contracts-transfer.md`  

---

## 📌 Notas

- Cada delegación debe registrarse inmediatamente después de completarse.  
- Este archivo complementa `contracts-governance.md`, `contracts-governance-log.md`, `contracts-ownership.md` y `contracts-transfer.md`.  
- La trazabilidad en delegaciones fortalece la confianza de la comunidad y exchanges.