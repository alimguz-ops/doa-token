// scripts/addLiquiditySafe.js (ESM)
import dotenv from "dotenv";
import fs from "fs";
import { ethers } from "ethers";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const routerAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const routerAbi = [
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)"
];
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const maxPriorityFee = ethers.parseUnits(process.env.MAX_PRIORITY_FEE || "30", "gwei");
const maxFee = ethers.parseUnits(process.env.MAX_FEE || "800", "gwei");

async function hasEnough(tokenAddr, requiredAmount) {
  const token = new ethers.Contract(tokenAddr, erc20Abi, wallet);
  const decimals = await token.decimals();
  const balance = await token.balanceOf(wallet.address);
  const required = ethers.parseUnits(requiredAmount, decimals);
  return balance >= required;
}

async function approveToken(tokenAddr, amount) {
  const token = new ethers.Contract(tokenAddr, erc20Abi, wallet);
  const decimals = await token.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);

  const tx = await token.approve(routerAddr, parsedAmount, {
    maxPriorityFeePerGas: maxPriorityFee,
    maxFeePerGas: maxFee
  });
  await tx.wait();
  console.log(`✅ Aprobado ${amount} para ${tokenAddr}`);
}

async function addLiquidity(tokenA, tokenB, amountA, amountB) {
  const router = new ethers.Contract(routerAddr, routerAbi, wallet);

  const tokenAContract = new ethers.Contract(tokenA, erc20Abi, wallet);
  const tokenBContract = new ethers.Contract(tokenB, erc20Abi, wallet);

  const decimalsA = await tokenAContract.decimals();
  const decimalsB = await tokenBContract.decimals();

  const amountAParsed = ethers.parseUnits(amountA, decimalsA);
  const amountBParsed = ethers.parseUnits(amountB, decimalsB);

  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    amountAParsed,
    amountBParsed,
    (amountAParsed * 95n) / 100n, // tolerancia 5%
    (amountBParsed * 95n) / 100n,
    wallet.address,
    deadline,
    {
      maxPriorityFeePerGas: maxPriorityFee,
      maxFeePerGas: maxFee
    }
  );

  const receipt = await tx.wait();
  console.log(`✅ Liquidez añadida: ${tokenA}/${tokenB} → TX: ${receipt.hash}`);

  // Guardar registro en deployments.json
  const deployments = fs.existsSync("deployments.json")
    ? JSON.parse(fs.readFileSync("deployments.json"))
    : [];
  deployments.push({
    pair: `${tokenA}/${tokenB}`,
    txHash: receipt.hash,
    timestamp: new Date().toISOString()
  });
  fs.writeFileSync("deployments.json", JSON.stringify(deployments, null, 2));
}

async function main() {
  const pairs = JSON.parse(fs.readFileSync("pairs.json"));

  for (const pair of pairs) {
    const okA = await hasEnough(pair.tokenA, pair.amountA);
    const okB = await hasEnough(pair.tokenB, pair.amountB);

    if (!okA || !okB) {
      console.log(`⚠️  Saltando par ${pair.tokenA}/${pair.tokenB} por saldo insuficiente`);
      continue;
    }

    try {
      await approveToken(pair.tokenA, pair.amountA);
      await approveToken(pair.tokenB, pair.amountB);
      await addLiquidity(pair.tokenA, pair.tokenB, pair.amountA, pair.amountB);
    } catch (err) {
      console.log(`❌ Error al añadir liquidez ${pair.tokenA}/${pair.tokenB}:`, err.message);
    }
  }

  console.log("🎯 Proceso completado.");
}

main().catch(console.error);