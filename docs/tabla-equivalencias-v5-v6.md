---
layout: default
title: tabla-equivalencias-v5-v6
---

# 🔄 DOA Token – Equivalencias ethers.js v5 → v6  
# 🔄 DOA Token – Equivalences ethers.js v5 → v6

Este documento resume las equivalencias entre funciones y objetos de **ethers.js v5** y su nueva implementación en **ethers.js v6**.  
Su objetivo es facilitar la migración de scripts y contratos, asegurando compatibilidad y buenas prácticas.  
This document summarizes the equivalences between **ethers.js v5** functions/objects and their new implementation in **ethers.js v6**.  
Its purpose is to facilitate migration of scripts and contracts, ensuring compatibility and best practices.  

---

## 📋 Tabla de Equivalencias / Equivalence Table

| Función / Objeto v5 | Equivalente en v6 | Nota práctica / Practical Note |
|----------------------|-------------------|--------------------------------|
| `ethers.providers.JsonRpcProvider` | `ethers.JsonRpcProvider` | Se eliminó el namespace `providers`. / The `providers` namespace was removed. |
| `ethers.utils.formatUnits(value, d)` | `ethers.formatUnits(value, d)` | `utils` ya no existe, todo está en la raíz. / `utils` no longer exists, everything is at the root. |
| `ethers.utils.parseUnits(value, d)` | `ethers.parseUnits(value, d)` | Igual que arriba. / Same as above. |
| `ethers.utils.getAddress(addr)` | `ethers.getAddress(addr)` | Validación de direcciones. / Address validation. |
| `ethers.utils.Interface(abi)` | `new ethers.Interface(abi)` | Ahora es clase directa. / Now a direct class. |
| `ethers.utils.keccak256(data)` | `ethers.keccak256(data)` | Hash directo. / Direct hash. |
| `ethers.utils.toUtf8String(bytes)` | `ethers.toUtf8String(bytes)` | Conversión de strings. / String conversion. |
| `ethers.utils.hexlify(data)` | `ethers.hexlify(data)` | Hex utils siguen igual pero sin `utils`. / Hex utils remain the same but without `utils`. |

---

## 📌 Notas / Notes
- Este archivo sirve como referencia rápida para migración de código entre v5 y v6.  
- This file serves as a quick reference for code migration between v5 and v6.  

- Complementa `technical-docs.md` y `scripts/`.  
- It complements `technical-docs.md` and `scripts/`.  

- La migración a v6 simplifica el uso de funciones al eliminar namespaces redundantes.  
- Migration to v6 simplifies function usage by removing redundant namespaces.  

---

<p align="center"><strong>Última actualización / Last update:</strong> Enero 2026</p>
