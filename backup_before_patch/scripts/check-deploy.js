// scripts/verifyContract.js
import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const contractName = process.env.CONTRACT_NAME;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractName || !contractAddress || !ethers.isAddress(contractAddress)) {
    throw new Error("❌ Faltan CONTRACT_NAME o CONTRACT_ADDRESS válidos en .env");
  }

  console.log(`🔍 Verificando contrato ${contractName} en ${contractAddress}...`);

  const Contract = await ethers.getContractAt(contractName, contractAddress);

  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    console.error("❌ No hay contrato en esa dirección.");
    return;
  }

  console.log("✅ El contrato está desplegado en la red.");
  console.log(`📦 Bytecode length: ${code.length}`);

  try {
    if (Contract.name) {
      console.log("Nombre:", await Contract.name());
    }
    if (Contract.symbol) {
      console.log("Símbolo:", await Contract.symbol());
    }
  } catch {
    console.log("ℹ️ El contrato no expone funciones name/symbol, pero está activo.");
  }
}

main().catch((err) => {
  console.error("❌ Error en verifyContract:", err.message);
  process.exitCode = 1;
});