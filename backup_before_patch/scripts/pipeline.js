// scripts/pipeline.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const rpc = process.env.POLYGON_RPC || process.env.RPC_URL || "https://polygon-rpc.com";
const provider = new ethers.JsonRpcProvider(rpc);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const quickswapRouter = process.env.ROUTER_QUICKSWAP_POLYGON || "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";

const routerAbi = [
  "function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
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
  const lpTokenAddress = process.env.PAIR_ADDR;
  const walletOwner = process.env.OWNER_ADDRESS;
  const usdtToken = process.env.USDT_POLYGON_ADDRESS || "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const binanceUsdt = process.env.BINANCE_USDT_ADDRESS || process.env.BINANCE_ADDRESS;

  if (!ethers.isAddress(doaToken) || !ethers.isAddress(lpTokenAddress) || !ethers.isAddress(usdtToken)) {
    throw new Error("❌ Direcciones inválidas en .env");
  }

  const deadlineSeconds = Number(process.env.DEADLINE_SECONDS || 1800);
  const deadline = Math.floor(Date.now() / 1000) + deadlineSeconds;
  const slippageBps = Number(process.env.SLIPPAGE_BPS || 50);

  console.log(`⏱ Deadline: ${deadline}, Slippage: ${slippageBps} bps`);

  const lpAbi = ["function balanceOf(address) view returns (uint256)"];
  const lpToken = new ethers.Contract(lpTokenAddress, lpAbi, provider);
  const liquidity = await lpToken.balanceOf(walletOwner);

  if (liquidity === 0n) {
    console.log("ℹ️ No hay LP tokens en la wallet para retirar.");
    return;
  }

  console.log(`🔹 Retirando ${ethers.formatUnits(liquidity, 18)} LP DOA/MATIC...`);
  const txRemove = await router.removeLiquidityETH(doaToken, liquidity, 0, 0, wallet.address, deadline);
  console.log("📄 Hash removeLiquidity:", txRemove.hash);
  const receiptRemove = await txRemove.wait();
  console.log(`✅ Liquidez retirada en bloque ${receiptRemove.blockNumber}, gas usado: ${receiptRemove.gasUsed}`);

  const doa = new ethers.Contract(doaToken, erc20Abi, wallet);
  const doaBalance = await doa.balanceOf(wallet.address);

  if (doaBalance > 0n) {
    const approveTx = await doa.approve(quickswapRouter, doaBalance);
    await approveTx.wait();

    const path = [doaToken, usdtToken];
    const amounts = await router.getAmountsOut(doaBalance, path);
    const expectedOut = amounts[amounts.length - 1];
    const amountOutMin = (expectedOut * BigInt(10000 - slippageBps)) / 10000n;

    console.log(`🔄 Swappeando ${ethers.formatUnits(doaBalance, 18)} DOA → USDT (min ${ethers.formatUnits(amountOutMin, 6)} USDT)...`);
    const txSwap = await router.swapExactTokensForTokens(doaBalance, amountOutMin, path, wallet.address, deadline);
    console.log("📄 Hash swap:", txSwap.hash);
    const receiptSwap = await txSwap.wait();
    console.log(`✅ Swap completado en bloque ${receiptSwap.blockNumber}, gas usado: ${receiptSwap.gasUsed}`);
  } else {
    console.log("ℹ️ No hay DOA para swappear tras retirar liquidez.");
  }

  const usdt = new ethers.Contract(usdtToken, erc20Abi, wallet);
  const usdtDecimals = await usdt.decimals();
  const usdtBalance = await usdt.balanceOf(wallet.address);

  if (!binanceUsdt) {
    console.log("⚠️ BINANCE_USDT_ADDRESS no está definido en el entorno. Se omite transferencia.");
  } else if (usdtBalance > 0n) {
    console.log(`🚀 Enviando ${ethers.formatUnits(usdtBalance, usdtDecimals)} USDT a Binance (${binanceUsdt})...`);
    const txTransfer = await usdt.transfer(binanceUsdt, usdtBalance);
    console.log("📄 Hash transfer:", txTransfer.hash);
    const receiptTransfer = await txTransfer.wait();
    console.log(`✅ Transferencia completada en bloque ${receiptTransfer.blockNumber}, gas usado: ${receiptTransfer.gasUsed}`);

    const logEntry = {
      date: new Date().toISOString(),
      action: "Pipeline DOA/MATIC → Binance",
      doaSwapped: ethers.formatUnits(await doa.balanceOf(wallet.address), 18),
      usdtSent: ethers.formatUnits(usdtBalance, usdtDecimals),
      txRemove: txRemove.hash,
      txTransfer: txTransfer.hash
    };

    const logFile = process.env.LOG_FILE || "burn-log.json";
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile));
    }
    logs.push(logEntry);

    if (fs.statSync(logFile).size > 5 * 1024 * 1024) {
      fs.renameSync(logFile, logFile.replace(".json", `-${Date.now()}.json`));
    }

    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    console.log(`📒 Pipeline registrado en ${logFile}`);
  } else {
    console.log("ℹ️ No hay USDT para transferir.");
  }
}

main().catch((err) => {
  console.error("❌ Error en pipeline:", err);
  process.exitCode = 1;
});