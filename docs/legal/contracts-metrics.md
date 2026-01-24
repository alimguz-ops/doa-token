# DOA Token – Contracts Metrics Register

Este documento recopila y analiza métricas clave de cada contrato inteligente del DOA Token.  
Su objetivo es garantizar transparencia, trazabilidad y confianza frente a auditores, comunidad y exchanges.

---

## 📊 Categorías de Métricas

1. **Uso del Contrato:**  
   - Número de transacciones.  
   - Volumen total transferido.  
   - Funciones más utilizadas (`transfer`, `burn`, `mint`).  

2. **Liquidez:**  
   - Reservas en pools de DEX.  
   - Volumen de liquidez añadida/retirada.  
   - Alertas registradas en `monitor-liquidez.js`.  

3. **Gobernanza:**  
   - Número de propuestas vinculadas al contrato.  
   - Votaciones registradas en `governance-log.md`.  
   - Cambios de propiedad documentados en `contracts-transfer.md`.  

4. **Seguridad:**  
   - Auditorías realizadas (`contracts-audit.md`).  
   - Incidentes registrados (`security-incidents.md`).  
   - Riesgos identificados (`contracts-risk.md`).  

---

## 📋 Formato de Registro

- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **Dirección:** Dirección en blockchain  
- **Periodo:** YYYY-MM-DD a YYYY-MM-DD  
- **Métricas de Uso:** transacciones, volumen, funciones críticas  
- **Métricas de Liquidez:** reservas, volumen, alertas  
- **Métricas de Gobernanza:** propuestas, votaciones, transferencias de propiedad  
- **Métricas de Seguridad:** auditorías, incidentes, riesgos  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos relacionados  

---

## 📒 Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **Dirección:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Periodo:** 2025-12-01 a 2025-12-31  
- **Métricas de Uso:**  
  - Transacciones: 12,450  
  - Volumen: 3,200,000 DOA  
  - Funciones críticas: `transfer` (85%), `burn` (10%), `mint` (5%)  
- **Métricas de Liquidez:**  
  - Reservas: 1,500,000 DOA en pool USDC/DOA  
  - Volumen añadido: 250,000 DOA  
  - Alertas: 2 (reserva mínima alcanzada)  
- **Métricas de Gobernanza:**  
  - Propuestas: 3  
  - Votaciones: 2 aprobadas, 1 rechazada  
  - Transferencias de propiedad: ninguna  
- **Métricas de Seguridad:**  
  - Auditorías: CertiK – issues-found (optimización de gas)  
  - Incidentes: ninguno  
  - Riesgos: mitigados en versión v2  
- **Notas:** Contrato estable con alta actividad comunitaria.  
- **Enlaces:**  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  
  - `contracts-audit.md`  
  - `contracts-risk.md`  

---

## 📌 Notas

- Este archivo complementa `contracts-log.md`, `contracts-audit.md`, `contracts-risk.md` y `community-metrics.md`.  
- Debe actualizarse mensualmente o tras cada auditoría relevante.  
- La trazabilidad en métricas fortalece la confianza de la comunidad y exchanges.