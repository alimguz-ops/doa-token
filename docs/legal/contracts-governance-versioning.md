# DOA Token – Contracts Governance Versioning

Este documento registra el control de versiones y cambios aplicados en contratos bajo procesos de gobernanza del DOA Token.  
Su objetivo es garantizar trazabilidad, transparencia y seguridad en cada modificación técnica o legal de los contratos.

---

## 🏛 Principios de Versionado

1. **Transparencia:** Cada cambio debe estar documentado y accesible a la comunidad.  
2. **Legitimidad:** Las versiones deben basarse en decisiones comunitarias registradas en `contracts-governance-decision.md`.  
3. **Seguridad:** Ningún cambio puede comprometer la integridad técnica o legal de los contratos.  
4. **Trazabilidad:** Cada versión debe reflejarse en `contracts-changelog.md` y `contracts-audit.md`.  
5. **Prevención:** El versionado debe anticipar riesgos documentados en `contracts-risk.md`.  

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Versión:** vX.Y.Z (ej. v1.2.0)  
- **Contrato Afectado:** Nombre y dirección del contrato  
- **Descripción del Cambio:** Breve explicación del cambio aplicado  
- **Motivo del Cambio:** propuesta | decisión | auditoría | incidente | cumplimiento  
- **Impacto:** técnico | legal | comunitario | operativo  
- **Estado:** `deployed` | `migrated` | `deprecated`  
- **Implementación:** Registro en `contracts-deploy.md`, `contracts-migration.md` o `contracts-transfer.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a auditorías, transacciones en PolygonScan o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-06-10  
- **Versión:** v1.3.0  
- **Contrato Afectado:** Liquidity Pool – `0x123...abc`  
- **Descripción del Cambio:** Ajuste de parámetros de liquidez mínima.  
- **Motivo del Cambio:** decisión comunitaria (P-028).  
- **Impacto:** técnico y comunitario.  
- **Estado:** deployed  
- **Implementación:** Documentado en `contracts-deploy.md` y `contracts-changelog.md`.  
- **Notas:** El cambio fortaleció la estabilidad del pool y la confianza comunitaria.  
- **Enlaces:**  
  - `contracts-governance-decision.md`  
  - `contracts-audit.md`  
  - `contracts-risk.md`  

---

## 📌 Notas

- Cada versión debe registrarse inmediatamente después de ser implementada.  
- Este archivo complementa `contracts-changelog.md`, `contracts-governance-decision.md`, `contracts-audit.md` y `contracts-risk.md`.  
- La trazabilidad en versiones fortalece la confianza de la comunidad y exchanges.- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Ajuste de Liquidez  
- **Contrato:** 0xDEF...456  
- **Estado:** resolved
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
- **Fecha:** 2025-12-27  
- **Versión Nueva:** Migraci�n Proxy v1.5  
- **Contrato:** 0xABC...123  
- **Estado:** migrated
