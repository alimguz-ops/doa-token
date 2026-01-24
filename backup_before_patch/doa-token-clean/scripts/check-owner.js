import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const contractName = process.env.CONTRACT_NAME || "DoaToken";
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("❌ Falta CONTRACT_ADDRESS en .env");
  }

  console.log(`🔍 Verificando propietario de ${contractName} en ${contractAddress}...`);

  const token = await ethers.getContractAt(contractName, contractAddress);

  try {
    const owner = await token.owner();
    console.log(`👑 El propietario actual del contrato es: ${owner}`);
  } catch (e) {
    console.error("⚠️ El contrato no expone función owner() o la llamada falló:", e.message);
  }
}

main().catch((error) => {
  console.error("❌ Error en verificación:", error.message);
  process.exitCode = 1;
});
