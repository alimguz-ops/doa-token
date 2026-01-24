# DOA Token â€“ Contracts Compliance Register

Este documento vincula cada contrato inteligente y contrato legal del DOA Token con sus requisitos de cumplimiento regulatorio.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## ðŸ“‹ Formato de Registro

- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **DirecciÃ³n / UbicaciÃ³n:** DirecciÃ³n en blockchain o ruta de archivo legal  
- **Requisitos de Cumplimiento:** AML/KYC | CertificaciÃ³n de No-Valor | Jurisdicciones | Otros  
- **Estado de Cumplimiento:** `compliant` | `pending` | `restricted`  
- **DocumentaciÃ³n Asociada:** Archivos vinculados en `legal/` y `compliance.md`  
- **AuditorÃ­a:** ValidaciÃ³n en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **DirecciÃ³n / UbicaciÃ³n:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Requisitos de Cumplimiento:**  
  - CertificaciÃ³n de No-Valor (`legal/certification.md`)  
  - PolÃ­ticas AML/KYC (`legal/AML-KYC.md`)  
  - Jurisdicciones (`legal/jurisdictions.md`)  
- **Estado de Cumplimiento:** compliant  
- **DocumentaciÃ³n Asociada:**  
  - `compliance.md`  
  - `contracts-audit.md`  
- **AuditorÃ­a:** CertiK â€“ validaciÃ³n 2025-12-20  
- **Notas:** OptimizaciÃ³n aplicada en funciÃ³n `transfer` tras hallazgos menores.  
- **Enlaces:**  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  
  - `contracts-log.md`  

---

## ðŸ“Œ Notas

- Cada contrato debe vincularse explÃ­citamente con sus requisitos de cumplimiento.  
- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y todo el bloque de `legal/`.  
- La trazabilidad en cumplimiento fortalece la confianza de la comunidad y exchanges.
