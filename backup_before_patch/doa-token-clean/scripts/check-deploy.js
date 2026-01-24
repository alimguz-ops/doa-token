import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const contractName = process.env.CONTRACT_NAME;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractName || !contractAddress) {
    throw new Error("Faltan CONTRACT_NAME o CONTRACT_ADDRESS en .env");
  }

  console.log(`🔍 Verificando contrato ${contractName} en ${contractAddress}...`);

  const Contract = await ethers.getContractAt(contractName, contractAddress);

  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    console.error("❌ No hay contrato en esa dirección.");
    return;
  }

  console.log("✅ El contrato está desplegado en la red.");

  try {
    if (Contract.name && Contract.symbol) {
      console.log("Nombre:", await Contract.name());
      console.log("Símbolo:", await Contract.symbol());
    }
  } catch {
    console.log("El contrato no expone funciones name/symbol, pero está activo.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
