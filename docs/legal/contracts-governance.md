# DOA Token – Contracts Governance Integration

Este documento describe cómo los contratos inteligentes y legales del DOA Token se integran y dependen del sistema de gobernanza.  
Su objetivo es garantizar trazabilidad, transparencia y coherencia entre decisiones comunitarias y ejecución técnica/legal.

---

## 🏛 Principios de Integración

1. **Transparencia:** Cada contrato debe estar vinculado a una propuesta y votación registrada en `governance-log.md`.  
2. **Responsabilidad:** Los cambios en contratos deben ser aprobados por la comunidad antes de su implementación.  
3. **Auditoría:** Toda modificación debe ser validada por auditores externos y registrada en `contracts-audit.md`.  
4. **Legalidad:** Los contratos deben cumplir con certificaciones y políticas documentadas en `legal/`.  

---

## 📋 Flujo de Gobernanza sobre Contratos

1. **Propuesta:**  
   - Creación en `proposals.md`.  
   - Publicación en `announcement.md`.  

2. **Votación:**  
   - Registro en `governance-log.md`.  
   - Estado final: `approved` o `rejected`.  

3. **Implementación:**  
   - Actualización del contrato inteligente en blockchain.  
   - Firma o modificación de contrato legal en `legal/`.  

4. **Auditoría:**  
   - Validación en `contracts-audit.md`.  
   - Registro en `audit-log.md`.  

5. **Comunicación:**  
   - Publicación de resultados en `announcement.md`.  
   - Inclusión en `changelog.md` y `releases.md`.  

---

## 📒 Ejemplo de Entrada

- **Contrato:** Token Contract (ERC-20)  
- **Propuesta:** P-001 – Ajuste en porcentaje de quema trimestral  
- **Votación:** Approved – 2026-01-22  
- **Implementación:** Actualización de función `burn` al 3% del balance Owner  
- **Auditoría:** CertiK – issues-found (optimización de gas)  
- **Registro:**  
  - `contracts-log.md`  
  - `contracts-audit.md`  
  - `governance-log.md`  

---

## 📌 Notas

- Este archivo complementa `contracts.md`, `contracts-log.md`, `contracts-audit.md` y todo el bloque de gobernanza.  
- Debe actualizarse cada vez que un contrato sea modificado o firmado bajo decisión comunitaria.  
- La integración entre contratos y gobernanza fortalece la legitimidad del DOA Token frente a comunidad, auditores y exchanges.