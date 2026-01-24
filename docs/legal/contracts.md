# DOA Token â€“ Contracts Register

Este documento centraliza y describe todos los contratos asociados al ecosistema DOA Token.  
Incluye contratos inteligentes desplegados en blockchain y contratos legales vinculados al proyecto.

---

## ðŸ“‹ Contratos Inteligentes

- **Token Contract (ERC-20):**  
  - DirecciÃ³n: `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
  - Funciones principales: `transfer`, `burn`, `mint`, `approve`.  
  - Proxy: registrado en `deployments.json`.  
  - AuditorÃ­a: documentada en `audit-report.md`.  

- **Liquidity Pool Contract:**  
  - DirecciÃ³n: [por definir tras deploy]  
  - Funciones principales: aÃ±adir/remover liquidez, gestiÃ³n de reservas.  
  - Monitoreo: `monitor-liquidez.js`.  

- **Governance Contract:**  
  - DirecciÃ³n: [por definir tras deploy]  
  - Funciones principales: creaciÃ³n de propuestas, votaciÃ³n, ejecuciÃ³n de decisiones.  
  - DocumentaciÃ³n: `governance.md`, `proposals.md`, `governance-log.md`.  

---

## ðŸ“‹ Contratos Legales

- **CertificaciÃ³n de No-Valor:**  
  - Documento: `legal/certification.md`.  
  - Alcance: confirma que el DOA Token no constituye un valor financiero.  

- **PolÃ­ticas AML/KYC:**  
  - Documento: `legal/AML-KYC.md`.  
  - Alcance: define procedimientos de prevenciÃ³n de lavado de dinero y verificaciÃ³n de identidad.  

- **Jurisdicciones:**  
  - Documento: `legal/jurisdictions.md`.  
  - Alcance: registro de cumplimiento regulatorio por paÃ­s.  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** Token Contract (ERC-20)  
- **DirecciÃ³n:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Estado:** activo  
- **AuditorÃ­a:** CertiK â€“ 2025-12-20  
- **Notas:** OptimizaciÃ³n aplicada en funciÃ³n `transfer` tras hallazgos menores.  

---

## ðŸ“Œ Notas

- Este archivo debe actualizarse cada vez que se despliegue un nuevo contrato o se firme un contrato legal.  
- Complementa `audit-report.md`, `compliance.md` y `governance.md`.  
- La transparencia en contratos fortalece la confianza de la comunidad y exchanges.
