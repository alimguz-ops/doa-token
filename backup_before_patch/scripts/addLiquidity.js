// scripts/addLiquidity.js (ESM + ethers v6)
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Router QuickSwap V2
const routerAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const routerAbi = [
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)"
];
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() view returns (uint8)"
];

// Tokens
const doa = "0x692d951163df3f7D9Fe071413F92c319D9B7369E"; // DOA V2
const wpol = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3Adf1270"; // WPOL

async function main() {
  const router = new ethers.Contract(routerAddr, routerAbi, wallet);

  // Montos iniciales DOA/WPOL
  const doaAmount = ethers.parseUnits("500000", 18); // 500k DOA
  const wpolAmount = ethers.parseUnits("100", 18);   // 100 WPOL

  const doaContract = new ethers.Contract(doa, erc20Abi, wallet);
  const wpolContract = new ethers.Contract(wpol, erc20Abi, wallet);

  console.log("🔑 Aprobando DOA...");
  await (await doaContract.approve(routerAddr, doaAmount)).wait();

  console.log("🔑 Aprobando WPOL...");
  await (await wpolContract.approve(routerAddr, wpolAmount)).wait();

  console.log("🚀 Añadiendo liquidez DOA/WPOL...");
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await router.addLiquidity(
    doa,
    wpol,
    doaAmount,
    wpolAmount,
    (doaAmount * 99n) / 100n, // 1% slippage
    (wpolAmount * 99n) / 100n,
    wallet.address, // LP tokens vuelven a tu wallet owner
    deadline
  );

  const receipt = await tx.wait();
  console.log("✅ Liquidez DOA/WPOL añadida. TX:", receipt.hash);
}

main().catch(console.error);