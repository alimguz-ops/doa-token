// scripts/addLiquidityFromPairs.js (ESM + ethers v6)
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
  "function decimals() view returns (uint8)"
];

async function addLiquidity(tokenA, tokenB, amountA, amountB) {
  const router = new ethers.Contract(routerAddr, routerAbi, wallet);

  const tokenAContract = new ethers.Contract(tokenA, erc20Abi, wallet);
  const tokenBContract = new ethers.Contract(tokenB, erc20Abi, wallet);

  const decimalsA = await tokenAContract.decimals();
  const decimalsB = await tokenBContract.decimals();

  const amountAParsed = ethers.parseUnits(amountA, decimalsA);
  const amountBParsed = ethers.parseUnits(amountB, decimalsB);

  console.log(`🔑 Aprobando ${tokenA}...`);
  await (
    await tokenAContract.approve(routerAddr, amountAParsed, {
      maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
      maxFeePerGas: ethers.parseUnits("60", "gwei")
    })
  ).wait();

  console.log(`🔑 Aprobando ${tokenB}...`);
  await (
    await tokenBContract.approve(routerAddr, amountBParsed, {
      maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
      maxFeePerGas: ethers.parseUnits("60", "gwei")
    })
  ).wait();

  console.log(`🚀 Añadiendo liquidez ${tokenA}/${tokenB}...`);
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    amountAParsed,
    amountBParsed,
    (amountAParsed * 99n) / 100n, // tolerancia 1%
    (amountBParsed * 99n) / 100n,
    wallet.address,
    deadline,
    {
      maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
      maxFeePerGas: ethers.parseUnits("60", "gwei")
    }
  );

  const receipt = await tx.wait();
  console.log(`✅ Liquidez añadida. TX: ${receipt.hash}`);
}

async function main() {
  const pairs = JSON.parse(fs.readFileSync("pairs.json"));

  const doa = "0x692d951163df3f7d9fe071413f92c319d9b7369e";
  const wpol = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

  const orderedPairs = [
    ...pairs.filter(
      (p) => p.tokenA === doa && p.tokenB.toLowerCase() === wpol.toLowerCase()
    ),
    ...pairs.filter(
      (p) => !(p.tokenA === doa && p.tokenB.toLowerCase() === wpol.toLowerCase())
    )
  ];

  for (const pair of orderedPairs) {
    await addLiquidity(pair.tokenA, pair.tokenB, pair.amountA, pair.amountB);
  }

  console.log("🎉 Todos los pares inicializados correctamente.");
}

main().catch(console.error);