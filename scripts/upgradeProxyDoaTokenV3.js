// scripts/upgradeProxyDoaTokenV3.js
import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;

  if (!proxyAddress || !ethers.utils.isAddress(proxyAddress)) {
    throw new Error("❌ CONTRACT_ADDRESS inválido o no definido en .env");
  }

  console.log(`⚙️ Preparando upgrade del proxy en ${proxyAddress}...`);

  // Nueva versión del contrato
  const DoaTokenV3 = await ethers.getContractFactory("DoaTokenV3");

  // Upgrade del proxy
  const upgraded = await upgrades.upgradeProxy(proxyAddress, DoaTokenV3);
  await upgraded.deployed();

  // Obtener direcciones clave
  const newImpl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);

  console.log("✅ Upgrade completado.");
  console.log("📍 Proxy address:", upgraded.address);
  console.log("📍 Nueva implementación (DOA V3):", newImpl);
  console.log("👑 Admin del proxy:", adminAddress);

  // Guardar en deployments.json para auditoría
  const deploymentsFile = "deployments.json";
  let deployments = {};
  if (fs.existsSync(deploymentsFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsFile));
  }
  deployments["DOA_V3"] = {
    proxy: upgraded.address,
    implementation: newImpl,
    admin: adminAddress,
    network: process.env.HARDHAT_NETWORK || "mainnet",
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(deploymentsFile, JSON.stringify(deployments, null, 2));

  console.log("📑 Datos guardados en deployments.json");
}

main().catch((err) => {
  console.error("❌ Error en upgradeProxy:", err);
  process.exitCode = 1;
});
