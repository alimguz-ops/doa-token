# DOA Token – Contracts Ownership & Permissions

Este documento define la gestión de propiedad, permisos y roles asociados a cada contrato inteligente del DOA Token.  
Su objetivo es garantizar transparencia, seguridad y trazabilidad en la administración de contratos.

---

## 🏛 Principios de Propiedad

1. **Transparencia:** La propiedad de cada contrato debe estar documentada y verificable en blockchain.  
2. **Seguridad:** Los permisos deben limitarse estrictamente a funciones necesarias.  
3. **Responsabilidad:** Los cambios de propiedad o permisos deben registrarse en `contracts-log.md`.  
4. **Gobernanza:** Toda modificación debe estar vinculada a propuestas y votaciones en `governance-log.md`.  

---

## 📋 Roles y Permisos

- **Owner (Propietario):**  
  - Control inicial del contrato.  
  - Puede transferir propiedad a la gobernanza comunitaria.  
  - Documentado en `contracts.md`.  

- **Admin (Administrador):**  
  - Gestiona parámetros operativos (ej. supply, quema, liquidez).  
  - Limitado por votaciones en `governance.md`.  

- **Community (Comunidad):**  
  - Participa en votaciones que afectan permisos y funciones críticas.  
  - Registro en `governance-log.md`.  

- **Auditors (Auditores):**  
  - Validan que los permisos coincidan con lo aprobado.  
  - Documentan hallazgos en `contracts-audit.md`.  

---

## 📋 Procedimientos de Gestión

1. **Asignación de Propiedad:**  
   - Registrar dirección del Owner en `contracts.md`.  
   - Confirmar en PolygonScan.  

2. **Transferencia de Propiedad:**  
   - Propuesta en `proposals.md`.  
   - Votación en `governance-log.md`.  
   - Registro en `contracts-log.md`.  

3. **Actualización de Permisos:**  
   - Validación técnica en `contracts-audit.md`.  
   - Publicación en `announcement.md`.  

---

## 📒 Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Owner:** Dirección `0x123...abc`  
- **Admin:** Dirección `0x456...def`  
- **Community:** Gobernanza activa vía Snapshot  
- **Auditors:** CertiK – validación 2025-12-20  
- **Notas:** Propiedad transferida a multisig comunitario tras votación P-002.  

---

## 📌 Notas

- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y `contracts-governance.md`.  
- Debe actualizarse cada vez que se modifique la propiedad o permisos de un contrato.  
- La trazabilidad en propiedad fortalece la confianza de la comunidad y exchanges.