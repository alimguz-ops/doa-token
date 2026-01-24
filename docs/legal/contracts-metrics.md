# DOA Token â€“ Contracts Metrics Register

Este documento recopila y analiza mÃ©tricas clave de cada contrato inteligente del DOA Token.  
Su objetivo es garantizar transparencia, trazabilidad y confianza frente a auditores, comunidad y exchanges.

---

## ðŸ“Š CategorÃ­as de MÃ©tricas

1. **Uso del Contrato:**  
   - NÃºmero de transacciones.  
   - Volumen total transferido.  
   - Funciones mÃ¡s utilizadas (`transfer`, `burn`, `mint`).  

2. **Liquidez:**  
   - Reservas en pools de DEX.  
   - Volumen de liquidez aÃ±adida/retirada.  
   - Alertas registradas en `monitor-liquidez.js`.  

3. **Gobernanza:**  
   - NÃºmero de propuestas vinculadas al contrato.  
   - Votaciones registradas en `governance-log.md`.  
   - Cambios de propiedad documentados en `contracts-transfer.md`.  

4. **Seguridad:**  
   - AuditorÃ­as realizadas (`contracts-audit.md`).  
   - Incidentes registrados (`security-incidents.md`).  
   - Riesgos identificados (`contracts-risk.md`).  

---

## ðŸ“‹ Formato de Registro

- **Contrato:** Nombre del contrato (ej. Token ERC-20, Liquidity Pool, Governance)  
- **DirecciÃ³n:** DirecciÃ³n en blockchain  
- **Periodo:** YYYY-MM-DD a YYYY-MM-DD  
- **MÃ©tricas de Uso:** transacciones, volumen, funciones crÃ­ticas  
- **MÃ©tricas de Liquidez:** reservas, volumen, alertas  
- **MÃ©tricas de Gobernanza:** propuestas, votaciones, transferencias de propiedad  
- **MÃ©tricas de Seguridad:** auditorÃ­as, incidentes, riesgos  
- **Notas:** Observaciones relevantes  
- **Enlaces:** URLs a PolygonScan, repositorio o documentos relacionados  

---

## ðŸ“’ Ejemplo de Entrada

- **Contrato:** DOA Token ERC-20  
- **DirecciÃ³n:** `0x692d951163df3f7D9Fe071413F92c319D9B7369E`  
- **Periodo:** 2025-12-01 a 2025-12-31  
- **MÃ©tricas de Uso:**  
  - Transacciones: 12,450  
  - Volumen: 3,200,000 DOA  
  - Funciones crÃ­ticas: `transfer` (85%), `burn` (10%), `mint` (5%)  
- **MÃ©tricas de Liquidez:**  
  - Reservas: 1,500,000 DOA en pool USDC/DOA  
  - Volumen aÃ±adido: 250,000 DOA  
  - Alertas: 2 (reserva mÃ­nima alcanzada)  
- **MÃ©tricas de Gobernanza:**  
  - Propuestas: 3  
  - Votaciones: 2 aprobadas, 1 rechazada  
  - Transferencias de propiedad: ninguna  
- **MÃ©tricas de Seguridad:**  
  - AuditorÃ­as: CertiK â€“ issues-found (optimizaciÃ³n de gas)  
  - Incidentes: ninguno  
  - Riesgos: mitigados en versiÃ³n v2  
- **Notas:** Contrato estable con alta actividad comunitaria.  
- **Enlaces:**  
  - [PolygonScan](https://polygonscan.com/address/0x692d951163df3f7D9Fe071413F92c319D9B7369E#code)  
  - `contracts-audit.md`  
  - `contracts-risk.md`  

---

## ðŸ“Œ Notas

- Este archivo complementa `contracts-log.md`, `contracts-audit.md`, `contracts-risk.md` y `community-metrics.md`.  
- Debe actualizarse mensualmente o tras cada auditorÃ­a relevante.  
- La trazabilidad en mÃ©tricas fortalece la confianza de la comunidad y exchanges.
