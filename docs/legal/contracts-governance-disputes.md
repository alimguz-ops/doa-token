# DOA Token â€“ Contracts Governance Disputes

Este documento registra disputas comunitarias en procesos de gobernanza que afectan contratos inteligentes y legales del DOA Token.  
Su objetivo es garantizar transparencia, trazabilidad y legitimidad en la resoluciÃ³n de conflictos surgidos durante la gobernanza.

---

## ðŸ› Principios de Registro de Disputas

1. **Transparencia:** Cada disputa debe estar documentada y accesible a la comunidad.  
2. **Legitimidad:** Las disputas deben basarse en registros verificables (`governance-log.md`, `contracts-governance-decision.md`).  
3. **Neutralidad:** La resoluciÃ³n debe ser conducida por comitÃ©s imparciales o entidades externas cuando sea necesario.  
4. **Seguridad:** Ninguna disputa puede comprometer la integridad tÃ©cnica o legal de los contratos.  
5. **Trazabilidad:** Cada disputa debe reflejarse en `contracts-governance-escalation.md` y `contracts-changelog.md`.  

---

## ðŸ“‹ Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Propuesta/DecisiÃ³n en Conflicto:** ID y tÃ­tulo de la propuesta o decisiÃ³n (ej. P-027 â€“ Ajuste de parÃ¡metros de liquidez)  
- **Contrato Afectado:** Nombre y direcciÃ³n del contrato  
- **DescripciÃ³n de la Disputa:** Breve explicaciÃ³n del conflicto comunitario  
- **Tipo de Disputa:** tÃ©cnica | legal | comunitaria | operativa  
- **Nivel de Escalamiento:** comunitario | comitÃ© de gobernanza | arbitraje externo | legal  
- **Estado:** `open` | `resolved` | `pending`  
- **ImplementaciÃ³n:** Registro en `contracts-deploy.md`, `contracts-migration.md` o `contracts-transfer.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a auditorÃ­as, transacciones en PolygonScan o documentos legales  

---

## ðŸ“’ Ejemplo de Entrada

- **Fecha:** 2026-06-05  
- **Propuesta/DecisiÃ³n en Conflicto:** P-027 â€“ Ajuste de parÃ¡metros de liquidez mÃ­nima  
- **Contrato Afectado:** Liquidity Pool â€“ `0x123...abc`  
- **DescripciÃ³n de la Disputa:** Parte de la comunidad argumentÃ³ que los parÃ¡metros aprobados favorecÃ­an a grandes holders.  
- **Tipo de Disputa:** comunitaria  
- **Nivel de Escalamiento:** comitÃ© de gobernanza  
- **Estado:** resolved  
- **ImplementaciÃ³n:** Documentado en `contracts-versioning.md` y `contracts-changelog.md`.  
- **Notas:** La disputa fortaleciÃ³ la confianza comunitaria en la gobernanza participativa.  
- **Enlaces:**  
  - `contracts-governance-escalation.md`  
  - `contracts-governance-decision.md`  
  - `contracts-compliance.md`  

---

## ðŸ“Œ Notas

- Cada disputa debe registrarse inmediatamente despuÃ©s de iniciarse.  
- Este archivo complementa `contracts-governance-escalation.md`, `contracts-governance-arbitration.md`, `contracts-governance-decision.md` y `contracts-compliance.md`.  
- La trazabilidad en disputas fortalece la confianza de la comunidad y exchanges.
