// scripts/swapTokens.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// RPC de Polygon
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Wallet que ejecuta el swap (Owner/Admin/Reserva)
const swapWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

// Dirección del Router de QuickSwap en Polygon
const quickswapRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";

// ABI mínimo del Router para swapExactTokensForTokens
const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

async function main() {
  const router = new ethers.Contract(quickswapRouter, routerAbi, swapWallet);

  // Configura tokens: DOA → USDT (puedes cambiar a MATIC si prefieres)
  const doaToken = process.env.CONTRACT_ADDRESS; // DOA Token
  const usdtToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDT en Polygon

  // Cantidad de DOA a convertir (ejemplo: 50,000 DOA)
  const amountIn = ethers.parseUnits("50000", 18);
  const amountOutMin = 0; // mínimo aceptado de USDT (ajusta si quieres protección contra slippage)

  const path = [doaToken, usdtToken];
  const to = swapWallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutos

  console.log(`🔄 Swappeando ${ethers.formatUnits(amountIn, 18)} DOA → USDT...`);
  const tx = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Swap completado. USDT enviados a tu wallet.");
}

main().catch((err) => {
  console.error("❌ Error en swapTokens:", err);
  process.exitCode = 1;
});
