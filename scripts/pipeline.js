// scripts/pipeline.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const quickswapRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const routerAbi = [
  "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) public returns (bool)"
];

async function main() {
  const router = new ethers.Contract(quickswapRouter, routerAbi, wallet);

  const doaToken = process.env.CONTRACT_ADDRESS;
  const maticToken = "0x0000000000000000000000000000000000001010";
  const usdtToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

  const liquidity = ethers.parseUnits("1.0", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log("🔹 Retirando liquidez DOA/MATIC...");
  const txRemove = await router.removeLiquidity(doaToken, maticToken, liquidity, 0, 0, wallet.address, deadline);
  await txRemove.wait();
  console.log("✅ Liquidez retirada:", txRemove.hash);

  const doa = new ethers.Contract(doaToken, erc20Abi, wallet);
  const doaBalance = await doa.balanceOf(wallet.address);
  await doa.approve(quickswapRouter, doaBalance);

  console.log(`🔄 Swappeando ${ethers.formatUnits(doaBalance, 18)} DOA → USDT...`);
  const txSwap = await router.swapExactTokensForTokens(doaBalance, 0, [doaToken, usdtToken], wallet.address, deadline);
  await txSwap.wait();
  console.log("✅ Swap completado:", txSwap.hash);

  const usdt = new ethers.Contract(usdtToken, erc20Abi, wallet);
  const usdtBalance = await usdt.balanceOf(wallet.address);
  const decimals = await usdt.decimals();

  console.log(`🚀 Enviando ${ethers.formatUnits(usdtBalance, decimals)} USDT a Binance...`);
  const txTransfer = await usdt.transfer(process.env.BINANCE_ADDRESS, usdtBalance);
  await txTransfer.wait();
  console.log("✅ Transferencia completada:", txTransfer.hash);

  const logEntry = {
    date: new Date().toISOString(),
    action: "Pipeline DOA/MATIC → Binance",
    doaSwapped: ethers.formatUnits(doaBalance, 18),
    usdtSent: ethers.formatUnits(usdtBalance, decimals),
    txRemove: txRemove.hash,
    txSwap: txSwap.hash,
    txTransfer: txTransfer.hash
  };

  let logs = [];
  if (fs.existsSync("burn-log.json")) {
    logs = JSON.parse(fs.readFileSync("burn-log.json"));
  }
  logs.push(logEntry);
  fs.writeFileSync("burn-log.json", JSON.stringify(logs, null, 2));

  console.log("📒 Pipeline registrado en burn-log.json");
}

main().catch((err) => {
  console.error("❌ Error en pipeline:", err);
  process.exitCode = 1;
});
