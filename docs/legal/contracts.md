# DOA Token – Contracts Register

Este documento centraliza y describe todos los contratos asociados al ecosistema DOA Token.  
Incluye contratos inteligentes desplegados en blockchain y contratos legales vinculados al proyecto.

---

## 📋 Contratos Inteligentes

- **Token Contract (ERC-20):**  
  - Dirección: `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
  - Funciones principales: `transfer`, `burn`, `mint`, `approve`.  
  - Proxy: registrado en `deployments.json`.  
  - Auditoría: documentada en `audit-report.md`.  

- **Liquidity Pool Contract:**  
  - Dirección: [por definir tras deploy]  
  - Funciones principales: añadir/remover liquidez, gestión de reservas.  
  - Monitoreo: `monitor-liquidez.js`.  

- **Governance Contract:**  
  - Dirección: [por definir tras deploy]  
  - Funciones principales: creación de propuestas, votación, ejecución de decisiones.  
  - Documentación: `governance.md`, `proposals.md`, `governance-log.md`.  

---

## 📋 Contratos Legales

- **Certificación de No-Valor:**  
  - Documento: `legal/certification.md`.  
  - Alcance: confirma que el DOA Token no constituye un valor financiero.  

- **Políticas AML/KYC:**  
  - Documento: `legal/AML-KYC.md`.  
  - Alcance: define procedimientos de prevención de lavado de dinero y verificación de identidad.  

- **Jurisdicciones:**  
  - Documento: `legal/jurisdictions.md`.  
  - Alcance: registro de cumplimiento regulatorio por país.  

---

## 📒 Ejemplo de Entrada

- **Contrato:** Token Contract (ERC-20)  
- **Dirección:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Estado:** activo  
- **Auditoría:** CertiK – 2025-12-20  
- **Notas:** Optimización aplicada en función `transfer` tras hallazgos menores.  

---

## 📌 Notas

- Este archivo debe actualizarse cada vez que se despliegue un nuevo contrato o se firme un contrato legal.  
- Complementa `audit-report.md`, `compliance.md` y `governance.md`.  
- La transparencia en contratos fortalece la confianza de la comunidad y exchanges.