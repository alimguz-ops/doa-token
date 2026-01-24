import fs from "fs";
import hardhat from "hardhat";

async function main() {
  if (!fs.existsSync(".last_deploy")) {
    throw new Error("No se encontró .last_deploy. Haz un deploy primero.");
  }
  const proxyAddress = fs.readFileSync(".last_deploy", "utf8").trim();

  const networkName = hardhat.network.name; // e.g. polygonAmoy
  const ozFile = `.openzeppelin/${networkName}.json`;
  if (!fs.existsSync(ozFile)) {
    throw new Error(`No se encontró el archivo ${ozFile}.`);
  }

  let ozData;
  try {
    ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));
  } catch (e) {
    throw new Error(`❌ Error parseando ${ozFile}: ${e.message}`);
  }

  const implKeys = Object.keys(ozData.impls);
  if (implKeys.length === 0) {
    throw new Error("No se encontró ninguna implementación en el archivo .openzeppelin.");
  }
  const implementationAddress = ozData.impls[implKeys[implKeys.length - 1]].address;

  const blockNumber = await hardhat.ethers.provider.getBlockNumber();

  console.log("📌 Direcciones del contrato en Polygon Amoy:");
  console.log("   Proxy:", proxyAddress);
  console.log("   Implementation:", implementationAddress);
  console.log(`   Red: ${networkName}, bloque actual: ${blockNumber}`);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});