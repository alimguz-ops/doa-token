# DOA Token – Hardhat Project

## ⚠️ Dirección comprometida
La dirección **0x2CC2eB354fba2f84E26a9D1c7ecfa7c2AeB841f8** está comprometida:
- No debe usarse para recibir POL/MATIC ni ejecutar despliegues.
- Todos los depósitos enviados a esta dirección son reenviados automáticamente a otra cuenta.
- La nueva dirección oficial para operaciones es: **0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5**.

---

Este proyecto contiene la configuración y scripts necesarios para desplegar y verificar el **DOA Token** en Polygon (mainnet) y Amoy (testnet).

## 🚀 Instalación limpia
1. Elimina dependencias rotas:
   ```powershell
   rd /s /q node_modules
   del package-lock.json

DOA Token Auditoría y Plan de Quema

📊 Supply Inicial y Distribución

Owner (0x6377…): 1,000,000 DOA

Admin (0xF224…): 200,000 DOA

Reserva (0xFE75…): 250,000 DOA

Comunidad (0xD1F7…): 100,000 DOA

Colaborador (0xE3BA…): 250,000 DOA

Supply total inicial: 1,800,000 DOA

🔥 Quema Inicial

Fecha: Diciembre 2025

Cuenta: Owner (0x6377…)

Cantidad: 100,000 DOA

Método: Transferencia al Dead Address (0x000000000000000000000000000000000000dEaD)

Hash de transacción: 0xc90ba1f6657e49d40a38b5d4d614d58d405834fbe530458dda6ae8e47e195543

Supply total después de quema inicial: 1,800,000 DOA

📅 Plan de Quema Trimestral

Periodicidad: Cada trimestre (cada 3 meses)

Porcentaje: 2% del balance del Owner

Método: Transferencia al Dead Address

Ejemplo: Con 900,000 DOA en Owner, se queman 18,000 DOA en el trimestre.

🛠 Scripts de Auditoría

checkAllBalances.js → Consulta balances de Owner, Admin, Reserva, Comunidad y Colaboradores.

checkTotalSupply.js → Consulta supply total actual del token.

mintTokens.js → Mint de tokens al Owner.

burnByTransferOwner.js → Quema inicial desde Owner.

burnByPercentage.js → Quema programada por porcentaje.

✅ Flujo de Auditoría

Ejecutar checkTotalSupply.js y checkAllBalances.js antes de cada burn.

Ejecutar burnByPercentage.js para quemar el % definido.

Confirmar supply y balances después del burn.

Documentar resultados en este README con fecha, cantidad y hash de transacción.

🎯 Beneficios del Plan

Transparencia y confianza en la comunidad.

Supply deflacionario controlado.

Evidencia auditable en Polygonscan.

Marketing positivo en cada hito trimestral.