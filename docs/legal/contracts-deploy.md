# DOA Token â€“ Contracts Deployment Guide

Este documento describe paso a paso el proceso de despliegue de cada contrato inteligente del DOA Token.  
Su objetivo es garantizar reproducibilidad, transparencia y trazabilidad en cada implementaciÃ³n.

---

## ðŸ“ PreparaciÃ³n

1. **RevisiÃ³n de CÃ³digo:**  
   - Validar funciones crÃ­ticas (`transfer`, `burn`, `mint`).  
   - Confirmar cumplimiento de estÃ¡ndares ERC-20.  

2. **ConfiguraciÃ³n de Entorno:**  
   - Variables sensibles en `.env`.  
   - Uso de `gitignore` para proteger credenciales.  
   - ActivaciÃ³n de pre-commit hooks para validaciones de seguridad.  

3. **AuditorÃ­a Previa:**  
   - ValidaciÃ³n inicial documentada en `contracts-audit.md`.  
   - Checklist completado en `audit-checklist.md`.  

---

## âš™ï¸ Proceso de Deploy

1. **CompilaciÃ³n:**  
   - Ejecutar `npx hardhat compile`.  
   - Confirmar que no existan errores ni advertencias crÃ­ticas.  

2. **Deploy Inicial:**  
   - Ejecutar script `deploy.js`.  
   - Registrar direcciÃ³n del contrato en `contracts.md`.  

3. **Proxy e ImplementaciÃ³n:**  
   - Registrar proxy en `deployments.json`.  
   - Documentar implementaciÃ³n en `contracts-log.md`.  

4. **VerificaciÃ³n en Blockchain:**  
   - Verificar contrato en PolygonScan.  
   - Adjuntar enlace en `contracts-log.md`.  

---

## ðŸ“‹ Post-Deploy

- **AuditorÃ­a Externa:** Documentar resultados en `contracts-audit.md`.  
- **Registro:** Actualizar `contracts-log.md` y `audit-log.md`.  
- **ComunicaciÃ³n:** Publicar anuncio oficial en `announcement.md`.  
- **Gobernanza:** Vincular cambios a propuesta en `governance-log.md`.  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Fecha de Deploy:** 2025-12-20  
- **DirecciÃ³n:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Proxy:** registrado en `deployments.json`  
- **AuditorÃ­a:** CertiK â€“ issues-found (optimizaciÃ³n de gas)  
- **Registro:**  
  - `contracts.md`  
  - `contracts-log.md`  
  - `contracts-audit.md`  

---

## ðŸ“Œ Notas

- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y `contracts-governance.md`.  
- Debe actualizarse cada vez que se despliegue un nuevo contrato.  
- La trazabilidad en deploy fortalece la confianza de la comunidad y exchanges.
