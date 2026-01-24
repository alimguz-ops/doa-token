// scripts/checkOwner.js
import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const contractName = process.env.CONTRACT_NAME || "DoaToken";
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress || !ethers.isAddress(contractAddress)) {
    throw new Error("❌ CONTRACT_ADDRESS inválido o no definido en .env");
  }

  console.log(`🔍 Verificando propietario de ${contractName} en ${contractAddress}...`);

  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    console.error("❌ No hay contrato en esa dirección.");
    return;
  }
  console.log("✅ El contrato está desplegado en la red.");
  console.log(`📦 Bytecode length: ${code.length}`);

  const token = await ethers.getContractAt(contractName, contractAddress);

  try {
    const owner = await token.owner();
    console.log(`👑 El propietario actual del contrato es: ${owner}`);
  } catch (e) {
    console.error("⚠️ El contrato no expone función owner() o la llamada falló:", e.message);
  }
}

main().catch((err) => {
  console.error("❌ Error en verificación:", err.message);
  process.exitCode = 1;
});