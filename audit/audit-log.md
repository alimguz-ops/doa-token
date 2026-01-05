# DOA Token – Audit Log

Este archivo documenta todas las auditorías realizadas sobre el contrato y el ecosistema del DOA Token.  
Cada entrada debe incluir **fecha, auditor, hallazgos, acciones correctivas y enlaces de verificación**.

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Auditor:** Nombre o entidad  
- **Scope:** Contrato, Liquidez, Tokenlist, Legal  
- **Hallazgos:** Descripción breve de los issues encontrados  
- **Acciones correctivas:** Pasos tomados para resolverlos  
- **Estado:** `pending` | `resolved` | `in-progress`  
- **Enlaces:** URL a Polygonscan, informe PDF, repositorio, etc.

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2025-12-27  
- **Auditor:** External Security Firm XYZ  
- **Scope:** Smart Contract (Proxy + Implementation)  
- **Hallazgos:**  
  - Falta de validación en función `mint()`  
  - Riesgo bajo en permisos de ProxyAdmin  
- **Acciones correctivas:**  
  - Se añadió validación de `onlyOwner` en `mint()`  
  - Se reforzó documentación de ProxyAdmin  
- **Estado:** resolved  
- **Enlaces:**  
  - [Polygonscan – Proxy](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  
  - [Polygonscan – Implementation](https://polygonscan.com/address/0xD6426Da6D01233Efe48dab6aD96cf3238f02c305#code)  
  - Informe PDF: `audit/audit-report-2025.pdf`

---

## 📌 Notas

- Cada auditoría debe registrarse inmediatamente después de completarse.  
- Los hallazgos y acciones correctivas deben ser claros y verificables.  
- Este archivo es parte del paquete de documentación oficial para exchanges y comunidad.  
