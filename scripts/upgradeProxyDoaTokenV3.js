require("dotenv").config();
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  // Detectar red actual
  const network = hre.network.name;

  // Seleccionar proxy según red
  let proxyAddress;
  if (network === "polygon") {
    proxyAddress = process.env.CONTRACT_ADDRESS; // Proxy DOA en Polygon
  } else if (network === "mainnet") {
    proxyAddress = process.env.CONTRACT_ADDRESS_ETHERSCAN; // Proxy DOA en Ethereum
  } else {
    throw new Error(`❌ Red ${network} no soportada en upgradeProxyDoaTokenV3.js`);
  }

  if (!proxyAddress || !ethers.isAddress(proxyAddress)) {
    throw new Error("❌ Dirección de proxy inválida o no definida en .env");
  }

  console.log(`⚙️ Preparando upgrade del proxy en ${proxyAddress} (${network})...`);

  // Nueva versión del contrato
  const DoaTokenV3 = await ethers.getContractFactory("DoaTokenV3");

  // Upgrade del proxy
  const upgraded = await upgrades.upgradeProxy(proxyAddress, DoaTokenV3);
  await upgraded.waitForDeployment();

  // Obtener direcciones clave
  const newImpl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);

  console.log("✅ Upgrade completado.");
  console.log("📍 Proxy address:", upgraded.target);
  console.log("📍 Nueva implementación (DOA V3):", newImpl);
  console.log("👑 Admin del proxy:", adminAddress);

  // Guardar en deployments.json para auditoría
  const deploymentsFile = "deployments.json";
  let deployments = {};
  if (fs.existsSync(deploymentsFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsFile));
  }
  deployments[`DOA_V3_${network.toUpperCase()}`] = {
    proxy: upgraded.target,
    implementation: newImpl,
    admin: adminAddress,
    network,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(deploymentsFile, JSON.stringify(deployments, null, 2));

  console.log("📑 Datos guardados en deployments.json");
}

main().catch((err) => {
  console.error("❌ Error en upgradeProxy:", err);
  process.exitCode = 1;
});
