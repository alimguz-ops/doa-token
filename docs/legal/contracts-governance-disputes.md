# DOA Token – Contracts Governance Disputes

Este documento registra disputas comunitarias en procesos de gobernanza que afectan contratos inteligentes y legales del DOA Token.  
Su objetivo es garantizar transparencia, trazabilidad y legitimidad en la resolución de conflictos surgidos durante la gobernanza.

---

## 🏛 Principios de Registro de Disputas

1. **Transparencia:** Cada disputa debe estar documentada y accesible a la comunidad.  
2. **Legitimidad:** Las disputas deben basarse en registros verificables (`governance-log.md`, `contracts-governance-decision.md`).  
3. **Neutralidad:** La resolución debe ser conducida por comités imparciales o entidades externas cuando sea necesario.  
4. **Seguridad:** Ninguna disputa puede comprometer la integridad técnica o legal de los contratos.  
5. **Trazabilidad:** Cada disputa debe reflejarse en `contracts-governance-escalation.md` y `contracts-changelog.md`.  

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Propuesta/Decisión en Conflicto:** ID y título de la propuesta o decisión (ej. P-027 – Ajuste de parámetros de liquidez)  
- **Contrato Afectado:** Nombre y dirección del contrato  
- **Descripción de la Disputa:** Breve explicación del conflicto comunitario  
- **Tipo de Disputa:** técnica | legal | comunitaria | operativa  
- **Nivel de Escalamiento:** comunitario | comité de gobernanza | arbitraje externo | legal  
- **Estado:** `open` | `resolved` | `pending`  
- **Implementación:** Registro en `contracts-deploy.md`, `contracts-migration.md` o `contracts-transfer.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a auditorías, transacciones en PolygonScan o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-06-05  
- **Propuesta/Decisión en Conflicto:** P-027 – Ajuste de parámetros de liquidez mínima  
- **Contrato Afectado:** Liquidity Pool – `0x123...abc`  
- **Descripción de la Disputa:** Parte de la comunidad argumentó que los parámetros aprobados favorecían a grandes holders.  
- **Tipo de Disputa:** comunitaria  
- **Nivel de Escalamiento:** comité de gobernanza  
- **Estado:** resolved  
- **Implementación:** Documentado en `contracts-versioning.md` y `contracts-changelog.md`.  
- **Notas:** La disputa fortaleció la confianza comunitaria en la gobernanza participativa.  
- **Enlaces:**  
  - `contracts-governance-escalation.md`  
  - `contracts-governance-decision.md`  
  - `contracts-compliance.md`  

---

## 📌 Notas

- Cada disputa debe registrarse inmediatamente después de iniciarse.  
- Este archivo complementa `contracts-governance-escalation.md`, `contracts-governance-arbitration.md`, `contracts-governance-decision.md` y `contracts-compliance.md`.  
- La trazabilidad en disputas fortalece la confianza de la comunidad y exchanges.