# DOA Token – Contracts Migration Register

Este documento describe y registra los procesos de migración de contratos inteligentes del DOA Token hacia nuevas versiones o arquitecturas.  
Su objetivo es garantizar trazabilidad, transparencia y reproducibilidad en cada migración.

---

## 📝 Principios de Migración

1. **Transparencia:** Cada migración debe estar vinculada a una propuesta y votación en `governance-log.md`.  
2. **Seguridad:** La migración debe ser auditada y documentada en `contracts-audit.md`.  
3. **Reproducibilidad:** Los pasos de migración deben estar claramente definidos y replicables.  
4. **Comunicación:** Los resultados deben publicarse en `announcement.md` y registrarse en `contracts-log.md`.  

---

## 📋 Flujo de Migración

1. **Propuesta de Migración:**  
   - Creación en `proposals.md`.  
   - Publicación en `announcement.md`.  

2. **Votación Comunitaria:**  
   - Registro en `governance-log.md`.  
   - Estado final: `approved` o `rejected`.  

3. **Deploy del Nuevo Contrato:**  
   - Documentar en `contracts-deploy.md`.  
   - Registrar dirección en `contracts.md`.  

4. **Transferencia de Propiedad y Datos:**  
   - Registro en `contracts-transfer.md`.  
   - Validación en `contracts-ownership.md`.  

5. **Auditoría de Migración:**  
   - Validación en `contracts-audit.md`.  
   - Registro en `audit-log.md`.  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-03-01  
- **Contrato Migrado:** DOA Token ERC-20 (versión inicial)  
- **Nuevo Contrato:** DOA Token ERC-20 v2  
- **Motivo:** Mejoras de seguridad y gobernanza  
- **Estado:** completed  
- **Propuesta:** P-003 – Aprobada por comunidad  
- **Auditoría:** CertiK – validación sin hallazgos críticos  
- **Notas:** Migración ejecutada exitosamente, contrato inicial marcado como `deprecated`.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-deploy.md`  
  - `contracts-transfer.md`  
  - `contracts-audit.md`  

---

## 📌 Notas

- Cada migración debe registrarse inmediatamente después de completarse.  
- Este archivo complementa `contracts-deploy.md`, `contracts-transfer.md`, `contracts-ownership.md` y `contracts-termination.md`.  
- La trazabilidad en migraciones fortalece la confianza de la comunidad y exchanges.