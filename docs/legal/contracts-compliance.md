# DOA Token – Contracts Compliance Register

Este documento vincula cada contrato inteligente y contrato legal del DOA Token con sus requisitos de cumplimiento regulatorio.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## 📋 Formato de Registro

- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **Dirección / Ubicación:** Dirección en blockchain o ruta de archivo legal  
- **Requisitos de Cumplimiento:** AML/KYC | Certificación de No-Valor | Jurisdicciones | Otros  
- **Estado de Cumplimiento:** `compliant` | `pending` | `restricted`  
- **Documentación Asociada:** Archivos vinculados en `legal/` y `compliance.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Dirección / Ubicación:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Requisitos de Cumplimiento:**  
  - Certificación de No-Valor (`legal/certification.md`)  
  - Políticas AML/KYC (`legal/AML-KYC.md`)  
  - Jurisdicciones (`legal/jurisdictions.md`)  
- **Estado de Cumplimiento:** compliant  
- **Documentación Asociada:**  
  - `compliance.md`  
  - `contracts-audit.md`  
- **Auditoría:** CertiK – validación 2025-12-20  
- **Notas:** Optimización aplicada en función `transfer` tras hallazgos menores.  
- **Enlaces:**  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  
  - `contracts-log.md`  

---

## 📌 Notas

- Cada contrato debe vincularse explícitamente con sus requisitos de cumplimiento.  
- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y todo el bloque de `legal/`.  
- La trazabilidad en cumplimiento fortalece la confianza de la comunidad y exchanges.