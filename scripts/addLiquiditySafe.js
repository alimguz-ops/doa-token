// scripts/addLiquiditySafe.js
require("dotenv").config();
const fs = require("fs");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const routerAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const routerAbi = [
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)"
];
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

const tokenDecimals = {
  "0x692d951163df3f7d9fe071413f92c319d9b7369e": 18, // DOA
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": 18  // WPOL (WMATIC)
};

const maxPriorityFee = ethers.utils.parseUnits(process.env.MAX_PRIORITY_FEE || "30", "gwei");
const maxFee = ethers.utils.parseUnits(process.env.MAX_FEE || "800", "gwei");

async function hasEnough(tokenAddr, requiredAmount) {
  const token = new ethers.Contract(tokenAddr, erc20Abi, wallet);
  const decimals = tokenDecimals[tokenAddr.toLowerCase()] || 18;
  const balance = await token.balanceOf(wallet.address);
  const required = ethers.utils.parseUnits(requiredAmount, decimals);
  return balance.gte(required);
}

async function addLiquidity(tokenA, tokenB, amountA, amountB) {
  const router = new ethers.Contract(routerAddr, routerAbi, wallet);

  const decimalsA = tokenDecimals[tokenA.toLowerCase()] || 18;
  const decimalsB = tokenDecimals[tokenB.toLowerCase()] || 18;

  const amountAParsed = ethers.utils.parseUnits(amountA, decimalsA);
  const amountBParsed = ethers.utils.parseUnits(amountB, decimalsB);

  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    amountAParsed,
    amountBParsed,
    amountAParsed.mul(90).div(100), // tolerancia 95%
    amountBParsed.mul(90).div(100), // tolerancia 95%
    wallet.address,
    deadline,
    {
      maxPriorityFeePerGas: maxPriorityFee,
      maxFeePerGas: maxFee
    }
  );

  const receipt = await tx.wait();
  console.log(`✅ Liquidez añadida: ${tokenA}/${tokenB} → TX: ${receipt.transactionHash}`);
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
      await addLiquidity(pair.tokenA, pair.tokenB, pair.amountA, pair.amountB);
    } catch (err) {
      console.log(`❌ Error al añadir liquidez ${pair.tokenA}/${pair.tokenB}:`, err.message);
    }
  }

  console.log("🎯 Proceso completado.");
}

main().catch(console.error);
