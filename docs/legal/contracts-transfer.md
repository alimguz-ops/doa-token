# DOA Token – Contracts Transfer Log

Este documento registra todas las transferencias de propiedad y permisos realizadas sobre los contratos inteligentes del DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **Dirección:** Dirección en blockchain del contrato  
- **Propietario Anterior:** Dirección del wallet o entidad previa  
- **Nuevo Propietario:** Dirección del wallet o entidad actual  
- **Motivo de Transferencia:** Breve descripción (ej. migración a multisig, decisión de gobernanza)  
- **Estado:** `completed` | `pending` | `rejected`  
- **Vinculación Gobernanza:** Propuesta y votación registrada en `governance-log.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a transacciones en PolygonScan, repositorio o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-01-22  
- **Contrato:** DOA Token ERC-20  
- **Dirección:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Propietario Anterior:** `0x123...abc`  
- **Nuevo Propietario:** Multisig comunitario `0x456...def`  
- **Motivo de Transferencia:** Votación P-002 – Transferencia de propiedad a gobernanza comunitaria  
- **Estado:** completed  
- **Vinculación Gobernanza:** `governance-log.md` – Propuesta P-002 aprobada  
- **Auditoría:** CertiK – validación sin hallazgos críticos  
- **Notas:** Transferencia ejecutada exitosamente, fortaleciendo descentralización.  
- **Enlaces:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## 📌 Notas

- Cada transferencia debe registrarse inmediatamente después de completarse.  
- Este archivo complementa `contracts-ownership.md`, `contracts-log.md`, `contracts-audit.md` y `governance-log.md`.  
- La trazabilidad en transferencias fortalece la confianza de la comunidad y exchanges.