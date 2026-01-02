// scripts/approve.js
require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

async function main() {
  const doaAddr = "0x692d951163df3f7d9fe071413f92c319d9b7369e"; // DOA
  const wpolAddr = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"; // WPOL (WMATIC)
  const routerAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap Router

  const doa = new ethers.Contract(doaAddr, erc20Abi, wallet);
  const wpol = new ethers.Contract(wpolAddr, erc20Abi, wallet);

  // Obtener datos de gas actuales de la red
  const feeData = await provider.getFeeData();

  // Forzar mínimo de 25 gwei en el tip
  let priorityFee = feeData.maxPriorityFeePerGas;
  if (priorityFee.lt(ethers.utils.parseUnits("25", "gwei"))) {
    priorityFee = ethers.utils.parseUnits("25", "gwei");
  }

  const overrides = {
    maxPriorityFeePerGas: priorityFee.add(ethers.utils.parseUnits("10", "gwei")), // margen extra
    maxFeePerGas: feeData.maxFeePerGas.add(ethers.utils.parseUnits("200", "gwei")), // margen sobre baseFee
    gasLimit: 100000
  };

  console.log("Aprobando DOA...");
  await (await doa.approve(routerAddr, ethers.constants.MaxUint256, overrides)).wait();

  console.log("Aprobando WPOL...");
  await (await wpol.approve(routerAddr, ethers.constants.MaxUint256, overrides)).wait();

  console.log("✅ Approve completado");
}

main().catch(console.error);
