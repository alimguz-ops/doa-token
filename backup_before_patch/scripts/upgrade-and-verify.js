import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const { ethers, upgrades, run } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Upgrading with account:", deployer.address);

  const { CONTRACT_NAME } = process.env;
  if (!CONTRACT_NAME) {
    throw new Error("❌ Falta CONTRACT_NAME en .env");
  }
  console.log(`📄 Usando CONTRACT_NAME: ${CONTRACT_NAME}`);

  // Leer la última dirección del proxy guardada
  if (!fs.existsSync(".last_deploy")) {
    throw new Error("❌ No se encontró .last_deploy con la dirección del proxy. Haz un deploy primero.");
  }
  const proxyAddress = fs.readFileSync(".last_deploy", "utf8").trim();
  if (!ethers.isAddress(proxyAddress)) {
    throw new Error("❌ Dirección de proxy inválida");
  }
  console.log("📦 Proxy a actualizar:", proxyAddress);

  // Preparar nueva implementación
  const Token = await ethers.getContractFactory(CONTRACT_NAME);
  console.log("🔧 Iniciando upgrade...");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Token);

  await upgraded.waitForDeployment();
  const receipt = await upgraded.deploymentTransaction().wait();
  console.log(`✅ Upgrade completado en proxy ${await upgraded.getAddress()} en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);

  // Leer archivo .openzeppelin para obtener la nueva implementación
  const networkName = hardhat.network.name; // e.g. polygonAmoy
  const ozFile = `.openzeppelin/${networkName}.json`;
  if (!fs.existsSync(ozFile)) {
    throw new Error(`❌ No se encontró el archivo ${ozFile}.`);
  }

  const ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));
  const implKeys = Object.keys(ozData.impls);
  if (implKeys.length === 0) {
    throw new Error("❌ No se encontró ninguna implementación en el archivo .openzeppelin.");
  }
  const implementationAddress = ozData.impls[implKeys[implKeys.length - 1]].address;

  console.log("🔍 Verificando nueva implementation en Polygonscan...");
  console.log("Implementation:", implementationAddress);

  try {
    await run("verify:verify", {
      address: implementationAddress,
      contract: `contracts/${CONTRACT_NAME}.sol:${CONTRACT_NAME}`,
      constructorArguments: [],
    });
    console.log("✅ Verificación completada en Polygonscan");
  } catch (error) {
    console.error("❌ Error en verificación:", error.message);
  }
}

main().catch((error) => {
  console.error("❌ Error general:", error.message);
  process.exitCode = 1;
});