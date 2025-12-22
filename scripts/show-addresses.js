import fs from "fs";
import hardhat from "hardhat";

async function main() {
  // Leer proxy desde .last_deploy
  if (!fs.existsSync(".last_deploy")) {
    throw new Error("No se encontró .last_deploy. Haz un deploy primero.");
  }
  const proxyAddress = fs.readFileSync(".last_deploy", "utf8").trim();

  // Leer implementación desde .openzeppelin
  const networkName = hardhat.network.name; // e.g. polygonAmoy
  const ozFile = `.openzeppelin/${networkName}.json`;
  if (!fs.existsSync(ozFile)) {
    throw new Error(`No se encontró el archivo ${ozFile}.`);
  }

  const ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));
  const implKeys = Object.keys(ozData.impls);
  if (implKeys.length === 0) {
    throw new Error("No se encontró ninguna implementación en el archivo .openzeppelin.");
  }
  const implementationAddress = ozData.impls[implKeys[implKeys.length - 1]].address;

  console.log("📌 Direcciones del contrato en Polygon Amoy:");
  console.log("   Proxy:", proxyAddress);
  console.log("   Implementation:", implementationAddress);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
