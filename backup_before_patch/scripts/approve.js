// scripts/approve.js (ESM + ethers v6)
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

async function main() {
  const doaAddr = "0x692d951163df3f7D9Fe071413F92c319D9B7369E"; // DOA V2
  const wpolAddr = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3Adf1270"; // WPOL (WMATIC)
  const routerAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap Router

  const doa = new ethers.Contract(doaAddr, erc20Abi, wallet);
  const wpol = new ethers.Contract(wpolAddr, erc20Abi, wallet);

  // Obtener datos de gas actuales de la red
  const feeData = await provider.getFeeData();

  // Forzar mínimo de 25 gwei en el tip
  let priorityFee = feeData.maxPriorityFeePerGas ?? ethers.parseUnits("25", "gwei");
  if (priorityFee < ethers.parseUnits("25", "gwei")) {
    priorityFee = ethers.parseUnits("25", "gwei");
  }

  const overrides = {
    maxPriorityFeePerGas: priorityFee + ethers.parseUnits("10", "gwei"),
    maxFeePerGas: (feeData.maxFeePerGas ?? ethers.parseUnits("200", "gwei")) + ethers.parseUnits("200", "gwei"),
    gasLimit: 100000n
  };

  console.log("🔑 Aprobando DOA...");
  await (await doa.approve(routerAddr, ethers.MaxUint256, overrides)).wait();

  console.log("🔑 Aprobando WPOL...");
  await (await wpol.approve(routerAddr, ethers.MaxUint256, overrides)).wait();

  console.log("✅ Approve completado");
}

main().catch(console.error);