---
layout: default
title: migration-guide
---

# 🔄 DOA Token – Migration Guide ethers.js v5 → v6  
# 🔄 DOA Token – Guía de Migración ethers.js v5 → v6

Este documento describe los pasos prácticos para migrar proyectos basados en **ethers.js v5** hacia **ethers.js v6**.  
Su objetivo es garantizar compatibilidad, simplificación de código y adopción de buenas prácticas.  
This document outlines practical steps to migrate projects based on **ethers.js v5** to **ethers.js v6**.  
Its purpose is to ensure compatibility, code simplification, and adoption of best practices.  

---

## ⚙️ Pasos de Migración / Migration Steps

1. **Actualizar dependencias / Update dependencies**  
   - Ejecutar / Run:  
     ```bash
     npm install ethers@latest
     ```  
   - Confirmar versión con / Confirm version with:  
     ```bash
     npm list ethers
     ```

2. **Eliminar namespaces obsoletos / Remove obsolete namespaces**  
   - En v6, `ethers.utils` y `ethers.providers` ya no existen.  
   - In v6, `ethers.utils` and `ethers.providers` no longer exist.  

3. **Reemplazar funciones clave / Replace key functions**  
   - Usar equivalencias de `tabla-equivalencias-v5-v6.md`.  
   - Use equivalences from `tabla-equivalencias-v5-v6.md`.  

   Ejemplo / Example:  
   ```js
   // v5
   const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
   const balance = await provider.getBalance(address);
   console.log(ethers.utils.formatUnits(balance, 18));

   // v6
   const provider = new ethers.JsonRpcProvider(RPC_URL);
   const balance = await provider.getBalance(address);
   console.log(ethers.formatUnits(balance, 18));
