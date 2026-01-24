import { run } from "hardhat";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

/**
 * Verifica automáticamente un contrato en PolygonScan
 * @param {string} contractAddress Dirección del contrato desplegado
 * @param {string} constructorArgs Ruta al archivo con argumentos del constructor (ej. arguments.js)
 */
export async function verifyContract(contractAddress, constructorArgs = "") {
  try {
    if (!contractAddress || !ethers.isAddress(contractAddress) || contractAddress === ethers.ZeroAddress) {
      throw new Error(`❌ Dirección inválida: ${contractAddress}`);
    }

    let args = [];
    if (constructorArgs) {
      try {
        args = require(constructorArgs);
      } catch (err) {
        console.warn("⚠️ No se pudo cargar argumentos, usando []");
        args = [];
      }
    }

    console.log(`📄 Iniciando verificación en PolygonScan para contrato en: ${contractAddress}`);
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("✅ Contrato verificado correctamente en PolygonScan");
  } catch (error) {
    console.error("❌ Error en la verificación:", error.message);
  }
}

// Ejemplo de uso directo
async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; // Dirección del contrato DOA
  await verifyContract(contractAddress, "./arguments.js");
}

main().catch((error) => {
  console.error("❌ Error general:", error.message);
  process.exitCode = 1;
});