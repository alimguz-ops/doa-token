import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const { ethers, upgrades } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("⚠️ Rollback iniciado con la cuenta:", deployer.address);

  // Leer la última dirección del proxy
  if (!fs.existsSync(".last_deploy")) {
    throw new Error("No se encontró .last_deploy con la dirección del proxy. Haz un deploy primero.");
  }
  const proxyAddress = fs.readFileSync(".last_deploy", "utf8").trim();
  console.log("📦 Proxy a revertir:", proxyAddress);

  // Leer archivo .openzeppelin para obtener implementaciones
  const networkName = hardhat.network.name; // e.g. polygonAmoy
  const ozFile = `.openzeppelin/${networkName}.json`;
  if (!fs.existsSync(ozFile)) {
    throw new Error(`No se encontró el archivo ${ozFile}.`);
  }

  const ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));
  const implKeys = Object.keys(ozData.impls);
  if (implKeys.length < 2) {
    throw new Error("No hay suficientes implementaciones para hacer rollback.");
  }

  // La penúltima implementación es la que queremos restaurar
  const previousImplKey = implKeys[implKeys.length - 2];
  const previousImplAddress = ozData.impls[previousImplKey].address;

  console.log("🔙 Restaurando implementación anterior:", previousImplAddress);

  // Usar ProxyAdmin para cambiar la implementación
  const admin = await upgrades.admin.getInstance();
  await admin.changeProxyImplementation(proxyAddress, previousImplAddress);

  console.log("✅ Rollback completado. Proxy ahora apunta a:", previousImplAddress);
}

main().catch((error) => {
  console.error("❌ Error en rollback:", error);
  process.exitCode = 1;
});
