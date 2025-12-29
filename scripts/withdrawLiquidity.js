// scripts/withdrawLiquidity.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// RPC de Polygon
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Wallet que posee los LP tokens (Owner/Admin/Reserva)
const lpWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

// Dirección del Router de QuickSwap en Polygon
const quickswapRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";

// ABI mínimo del Router para removeLiquidity
const routerAbi = [
  "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)"
];

async function main() {
  const router = new ethers.Contract(quickswapRouter, routerAbi, lpWallet);

  // Configura los tokens del par DOA/MATIC
  const tokenA = process.env.CONTRACT_ADDRESS; // DOA Token
  const tokenB = "0x0000000000000000000000000000000000001010"; // MATIC nativo en Polygon

  // Cantidad de LP tokens a retirar (ejemplo: 100%)
  const liquidity = ethers.parseUnits("1.0", 18); // Ajusta según tus LP tokens
  const amountAMin = 0; // mínimo aceptado de DOA
  const amountBMin = 0; // mínimo aceptado de MATIC
  const to = lpWallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutos

  console.log(`🔹 Retirando liquidez del par DOA/MATIC hacia ${to}...`);
  const tx = await router.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Liquidez retirada. DOA y MATIC enviados a tu wallet.");
}

main().catch((err) => {
  console.error("❌ Error en withdrawLiquidity:", err);
  process.exitCode = 1;
});
