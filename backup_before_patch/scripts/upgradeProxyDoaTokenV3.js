// scripts/upgradeProxyDoaTokenV3.js
import hardhat from "hardhat";
const { ethers, upgrades } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress || !ethers.isAddress(proxyAddress)) {
    throw new Error("❌ CONTRACT_ADDRESS inválido o no definido en .env");
  }

  console.log(`⚙️ Preparando upgrade del proxy en ${proxyAddress}...`);

  // Nueva versión del contrato
  const DoaTokenV3 = await ethers.getContractFactory("DoaTokenV3");

  // Upgrade del proxy
  const upgraded = await upgrades.upgradeProxy(proxyAddress, DoaTokenV3);
  await upgraded.waitForDeployment();

  const newImpl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("✅ Upgrade completado.");
  console.log("📍 Nueva implementación en:", newImpl);

  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
  console.log("👑 Admin del proxy:", adminAddress);
}

main().catch((err) => {
  console.error("❌ Error en upgradeProxy:", err.message);
  process.exitCode = 1;
});