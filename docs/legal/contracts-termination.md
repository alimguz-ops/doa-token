# DOA Token – Contracts Termination Register

Este documento registra la finalización, desactivación o migración de contratos inteligentes y legales asociados al DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Tipo de Contrato:** Smart Contract | Legal Contract  
- **Nombre / Descripción:** Breve título del contrato  
- **Dirección / Ubicación:** Dirección en blockchain o ruta de archivo legal  
- **Motivo de Terminación:** Breve explicación (ej. migración, obsolescencia, decisión de gobernanza)  
- **Estado:** `terminated` | `migrated` | `deprecated`  
- **Vinculación Gobernanza:** Propuesta y votación registrada en `governance-log.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a transacciones en PolygonScan, repositorio o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-03-01  
- **Tipo de Contrato:** Smart Contract  
- **Nombre / Descripción:** DOA Token ERC-20 (versión inicial)  
- **Dirección / Ubicación:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Motivo de Terminación:** Migración a nueva versión con mejoras de seguridad y gobernanza  
- **Estado:** migrated  
- **Vinculación Gobernanza:** Propuesta P-003 – Aprobada por comunidad  
- **Auditoría:** CertiK – validación de migración sin hallazgos críticos  
- **Notas:** Contrato inicial desactivado, nueva versión registrada en `contracts-log.md`.  
- **Enlaces:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## 📌 Notas

- Cada terminación o migración debe registrarse inmediatamente después de completarse.  
- Este archivo complementa `contracts-log.md`, `contracts-audit.md`, `contracts-ownership.md` y `contracts-governance.md`.  
- La trazabilidad en terminaciones fortalece la confianza de la comunidad y exchanges.