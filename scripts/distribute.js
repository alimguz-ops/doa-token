// scripts/distribute.js
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress || !ethers.utils.isAddress(proxyAddress)) {
    throw new Error(`❌ CONTRACT_ADDRESS inválido: ${proxyAddress}`);
  }

  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);

  // Leer lista de distribución desde distribution.json
  const distribution = JSON.parse(fs.readFileSync("distribution.json"));

  for (const entry of distribution) {
    const { address, amount } = entry;

    if (!ethers.utils.isAddress(address)) {
      console.warn(`⚠️ Dirección inválida omitida: ${address}`);
      continue;
    }

    const tx = await doa.transfer(address, ethers.utils.parseUnits(amount, 18));
    console.log(`📤 Transferencia enviada: ${amount} DOA → ${address}, tx: ${tx.hash}`);
    await tx.wait();
  }

  console.log("✅ Distribución completada.");
}

main().catch((e) => {
  console.error("❌ Error en distribute:", e);
  process.exitCode = 1;
});
