# DOA Token â€“ Contracts Ownership & Permissions

Este documento define la gestiÃ³n de propiedad, permisos y roles asociados a cada contrato inteligente del DOA Token.  
Su objetivo es garantizar transparencia, seguridad y trazabilidad en la administraciÃ³n de contratos.

---

## ðŸ› Principios de Propiedad

1. **Transparencia:** La propiedad de cada contrato debe estar documentada y verificable en blockchain.  
2. **Seguridad:** Los permisos deben limitarse estrictamente a funciones necesarias.  
3. **Responsabilidad:** Los cambios de propiedad o permisos deben registrarse en `contracts-log.md`.  
4. **Gobernanza:** Toda modificaciÃ³n debe estar vinculada a propuestas y votaciones en `governance-log.md`.  

---

## ðŸ“‹ Roles y Permisos

- **Owner (Propietario):**  
  - Control inicial del contrato.  
  - Puede transferir propiedad a la gobernanza comunitaria.  
  - Documentado en `contracts.md`.  

- **Admin (Administrador):**  
  - Gestiona parÃ¡metros operativos (ej. supply, quema, liquidez).  
  - Limitado por votaciones en `governance.md`.  

- **Community (Comunidad):**  
  - Participa en votaciones que afectan permisos y funciones crÃ­ticas.  
  - Registro en `governance-log.md`.  

- **Auditors (Auditores):**  
  - Validan que los permisos coincidan con lo aprobado.  
  - Documentan hallazgos en `contracts-audit.md`.  

---

## ðŸ“‹ Procedimientos de GestiÃ³n

1. **AsignaciÃ³n de Propiedad:**  
   - Registrar direcciÃ³n del Owner en `contracts.md`.  
   - Confirmar en PolygonScan.  

2. **Transferencia de Propiedad:**  
   - Propuesta en `proposals.md`.  
   - VotaciÃ³n en `governance-log.md`.  
   - Registro en `contracts-log.md`.  

3. **ActualizaciÃ³n de Permisos:**  
   - ValidaciÃ³n tÃ©cnica en `contracts-audit.md`.  
   - PublicaciÃ³n en `announcement.md`.  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Owner:** DirecciÃ³n `0x123...abc`  
- **Admin:** DirecciÃ³n `0x456...def`  
- **Community:** Gobernanza activa vÃ­a Snapshot  
- **Auditors:** CertiK â€“ validaciÃ³n 2025-12-20  
- **Notas:** Propiedad transferida a multisig comunitario tras votaciÃ³n P-002.  

---

## ðŸ“Œ Notas

- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y `contracts-governance.md`.  
- Debe actualizarse cada vez que se modifique la propiedad o permisos de un contrato.  
- La trazabilidad en propiedad fortalece la confianza de la comunidad y exchanges.
