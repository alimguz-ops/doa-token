# DOA Token â€“ Contracts Governance Integration

Este documento describe cÃ³mo los contratos inteligentes y legales del DOA Token se integran y dependen del sistema de gobernanza.  
Su objetivo es garantizar trazabilidad, transparencia y coherencia entre decisiones comunitarias y ejecuciÃ³n tÃ©cnica/legal.

---

## ðŸ› Principios de IntegraciÃ³n

1. **Transparencia:** Cada contrato debe estar vinculado a una propuesta y votaciÃ³n registrada en `governance-log.md`.  
2. **Responsabilidad:** Los cambios en contratos deben ser aprobados por la comunidad antes de su implementaciÃ³n.  
3. **AuditorÃ­a:** Toda modificaciÃ³n debe ser validada por auditores externos y registrada en `contracts-audit.md`.  
4. **Legalidad:** Los contratos deben cumplir con certificaciones y polÃ­ticas documentadas en `legal/`.  

---

## ðŸ“‹ Flujo de Gobernanza sobre Contratos

1. **Propuesta:**  
   - CreaciÃ³n en `proposals.md`.  
   - PublicaciÃ³n en `announcement.md`.  

2. **VotaciÃ³n:**  
   - Registro en `governance-log.md`.  
   - Estado final: `approved` o `rejected`.  

3. **ImplementaciÃ³n:**  
   - ActualizaciÃ³n del contrato inteligente en blockchain.  
   - Firma o modificaciÃ³n de contrato legal en `legal/`.  

4. **AuditorÃ­a:**  
   - ValidaciÃ³n en `contracts-audit.md`.  
   - Registro en `audit-log.md`.  

5. **ComunicaciÃ³n:**  
   - PublicaciÃ³n de resultados en `announcement.md`.  
   - InclusiÃ³n en `changelog.md` y `releases.md`.  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** Token Contract (ERC-20)  
- **Propuesta:** P-001 â€“ Ajuste en porcentaje de quema trimestral  
- **VotaciÃ³n:** Approved â€“ 2026-01-22  
- **ImplementaciÃ³n:** ActualizaciÃ³n de funciÃ³n `burn` al 3% del balance Owner  
- **AuditorÃ­a:** CertiK â€“ issues-found (optimizaciÃ³n de gas)  
- **Registro:**  
  - `contracts-log.md`  
  - `contracts-audit.md`  
  - `governance-log.md`  

---

## ðŸ“Œ Notas

- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y todo el bloque de gobernanza.  
- Debe actualizarse cada vez que un contrato sea modificado o firmado bajo decisiÃ³n comunitaria.  
- La integraciÃ³n entre contratos y gobernanza fortalece la legitimidad del DOA Token frente a comunidad, auditores y exchanges.
