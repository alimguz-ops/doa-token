# DOA Token – Contracts Incidents Register

Este documento registra incidentes, fallos o vulnerabilidades detectados en contratos inteligentes y legales del DOA Token, junto con sus resoluciones.  
Su objetivo es garantizar trazabilidad, transparencia y confianza frente a auditores, comunidad y exchanges.

---

## 🛡 Principios de Registro de Incidentes

1. **Transparencia:** Todo incidente debe documentarse inmediatamente después de ser detectado.  
2. **Responsabilidad:** Cada incidente debe vincularse a acciones correctivas y auditorías.  
3. **Gobernanza:** Las resoluciones deben estar alineadas con decisiones comunitarias registradas en `governance-log.md`.  
4. **Prevención:** Los incidentes deben alimentar el registro de riesgos en `contracts-risk.md`.  

---

## 📋 Formato de Registro

- **Fecha:** YYYY-MM-DD  
- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **Dirección / Ubicación:** Dirección en blockchain o ruta de archivo legal  
- **Tipo de Incidente:** Técnico | Legal | Operacional | Gobernanza  
- **Descripción:** Breve explicación del incidente detectado  
- **Impacto:** `alto` | `medio` | `bajo`  
- **Acciones Correctivas:** Medidas aplicadas para resolver el incidente  
- **Estado:** `open` | `resolved` | `mitigated`  
- **Gobernanza:** Propuesta y votación vinculada en `governance-log.md`  
- **Auditoría:** Validación en `contracts-audit.md`  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a reportes, transacciones o documentos legales  

---

## 📒 Ejemplo de Entrada

- **Fecha:** 2026-02-10  
- **Contrato:** DOA Token ERC-20  
- **Dirección / Ubicación:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Tipo de Incidente:** Técnico  
- **Descripción:** Error en la función `burn` que permitía quemar más tokens de los disponibles.  
- **Impacto:** alto  
- **Acciones Correctivas:**  
  - Hotfix aplicado en contrato v1.  
  - Migración a contrato v2 documentada en `contracts-migration.md`.  
- **Estado:** resolved  
- **Gobernanza:** Propuesta P-004 – Aprobada por comunidad.  
- **Auditoría:** CertiK – validación sin hallazgos críticos tras corrección.  
- **Notas:** El incidente reforzó la necesidad de auditorías preventivas.  
- **Enlaces:**  
  - `contracts-log.md`  
  - `contracts-risk.md`  
  - `contracts-migration.md`  

---

## 📌 Notas

- Cada incidente debe registrarse inmediatamente después de ser detectado.  
- Este archivo complementa `contracts-risk.md`, `contracts-audit.md`, `contracts-log.md` y `security-incidents.md`.  
- La trazabilidad en incidentes fortalece la confianza de la comunidad y exchanges.