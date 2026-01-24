// scripts/swapTokens.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
const swapWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const quickswapRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";

const routerAbi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) view returns (uint[] memory amounts)"
];

async function main() {
  const doaToken = process.env.CONTRACT_ADDRESS;
  const usdtToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

  if (!ethers.isAddress(doaToken) || !ethers.isAddress(usdtToken)) {
    throw new Error("❌ Dirección de token inválida");
  }

  const router = new ethers.Contract(quickswapRouter, routerAbi, swapWallet);

  const amountIn = ethers.parseUnits("50000", 18);
  const path = [doaToken, usdtToken];
  const to = swapWallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 600;

  // Aprobar DOA para el router
  const doaAbi = ["function approve(address spender, uint256 amount) returns (bool)"];
  const doaContract = new ethers.Contract(doaToken, doaAbi, swapWallet);
  await doaContract.approve(quickswapRouter, amountIn);
  console.log("✅ DOA aprobado para el router");

  // Calcular mínimo aceptable con slippage
  const amounts = await router.getAmountsOut(amountIn, path);
  const amountOutMin = (amounts[1] * 95n) / 100n; // 5% slippage

  console.log(`🔄 Swappeando ${ethers.formatUnits(amountIn, 18)} DOA → USDT...`);
  const tx = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
  console.log("📄 Hash de transacción:", tx.hash);

  const receipt = await tx.wait();
  console.log(`🎉 Swap completado en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);
}

main().catch((err) => {
  console.error("❌ Error en swapTokens:", err.message);
  process.exit(1);
});