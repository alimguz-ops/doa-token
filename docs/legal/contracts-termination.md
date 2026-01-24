# DOA Token â€“ Contracts Termination Register

Este documento registra la finalizaciÃ³n, desactivaciÃ³n o migraciÃ³n de contratos inteligentes y legales asociados al DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## ðŸ“‹ Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Tipo de Contrato:** Smart Contract | Legal Contract  
- **Nombre / DescripciÃ³n:** Breve tÃ­tulo del contrato  
- **DirecciÃ³n / UbicaciÃ³n:** DirecciÃ³n en blockchain o ruta de archivo legal  
- **Motivo de TerminaciÃ³n:** Breve explicaciÃ³n (ej. migraciÃ³n, obsolescencia, decisiÃ³n de gobernanza)  
- **Estado:** `terminated` | `migrated` | `deprecated`  
- **VinculaciÃ³n Gobernanza:** Propuesta y votaciÃ³n registrada en `governance-log.md`  
- **AuditorÃ­a:** ValidaciÃ³n en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a transacciones en PolygonScan, repositorio o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Fecha:** 2026-03-01  
- **Tipo de Contrato:** Smart Contract  
- **Nombre / DescripciÃ³n:** DOA Token ERC-20 (versiÃ³n inicial)  
- **DirecciÃ³n / UbicaciÃ³n:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Motivo de TerminaciÃ³n:** MigraciÃ³n a nueva versiÃ³n con mejoras de seguridad y gobernanza  
- **Estado:** migrated  
- **VinculaciÃ³n Gobernanza:** Propuesta P-003 â€“ Aprobada por comunidad  
- **AuditorÃ­a:** CertiK â€“ validaciÃ³n de migraciÃ³n sin hallazgos crÃ­ticos  
- **Notas:** Contrato inicial desactivado, nueva versiÃ³n registrada en `contracts-log.md`.  
- **Enlaces:**  
  - [PolygonScan Transaction](https://polygonscan.com/tx/example)  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## ðŸ“Œ Notas

- Cada terminaciÃ³n o migraciÃ³n debe registrarse inmediatamente despuÃ©s de completarse.  
- Este archivo complementa `contracts-log.md`, `contracts-audit.md`, `contracts-ownership.md` y `contracts-governance.md`.  
- La trazabilidad en terminaciones fortalece la confianza de la comunidad y exchanges.
