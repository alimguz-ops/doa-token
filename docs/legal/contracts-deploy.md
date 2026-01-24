# DOA Token – Contracts Deployment Guide

Este documento describe paso a paso el proceso de despliegue de cada contrato inteligente del DOA Token.  
Su objetivo es garantizar reproducibilidad, transparencia y trazabilidad en cada implementación.

---

## 📝 Preparación

1. **Revisión de Código:**  
   - Validar funciones críticas (`transfer`, `burn`, `mint`).  
   - Confirmar cumplimiento de estándares ERC-20.  

2. **Configuración de Entorno:**  
   - Variables sensibles en `.env`.  
   - Uso de `gitignore` para proteger credenciales.  
   - Activación de pre-commit hooks para validaciones de seguridad.  

3. **Auditoría Previa:**  
   - Validación inicial documentada en `contracts-audit.md`.  
   - Checklist completado en `audit-checklist.md`.  

---

## ⚙️ Proceso de Deploy

1. **Compilación:**  
   - Ejecutar `npx hardhat compile`.  
   - Confirmar que no existan errores ni advertencias críticas.  

2. **Deploy Inicial:**  
   - Ejecutar script `deploy.js`.  
   - Registrar dirección del contrato en `contracts.md`.  

3. **Proxy e Implementación:**  
   - Registrar proxy en `deployments.json`.  
   - Documentar implementación en `contracts-log.md`.  

4. **Verificación en Blockchain:**  
   - Verificar contrato en PolygonScan.  
   - Adjuntar enlace en `contracts-log.md`.  

---

## 📋 Post-Deploy

- **Auditoría Externa:** Documentar resultados en `contracts-audit.md`.  
- **Registro:** Actualizar `contracts-log.md` y `audit-log.md`.  
- **Comunicación:** Publicar anuncio oficial en `announcement.md`.  
- **Gobernanza:** Vincular cambios a propuesta en `governance-log.md`.  

---

## 📒 Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Fecha de Deploy:** 2025-12-20  
- **Dirección:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Proxy:** registrado en `deployments.json`  
- **Auditoría:** CertiK – issues-found (optimización de gas)  
- **Registro:**  
  - `contracts.md`  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## 📌 Notas

- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y `contracts-governance.md`.  
- Debe actualizarse cada vez que se despliegue un nuevo contrato.  
- La trazabilidad en deploy fortalece la confianza de la comunidad y exchanges.