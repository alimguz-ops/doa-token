require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("♻️ Rollback en Polygon/Amoy usando Proxy...");

  const proxyAddress = process.env.PROXY_ADDRESS;
  const oldImplAddress = process.env.OLD_IMPL_ADDRESS;
  const proxyAdminAddress = process.env.PROXY_ADMIN;

  if (!proxyAddress || !oldImplAddress || !proxyAdminAddress) {
    throw new Error("❌ Faltan variables en .env: PROXY_ADDRESS, OLD_IMPL_ADDRESS, PROXY_ADMIN");
  }

  console.log("Usando configuración:");
  console.log(` - Proxy: ${proxyAddress}`);
  console.log(` - Implementación anterior: ${oldImplAddress}`);
  console.log(` - ProxyAdmin: ${proxyAdminAddress}`);

  const proxyAdmin = await ethers.getContractAt("ProxyAdmin", proxyAdminAddress);

  const tx = await proxyAdmin.upgrade(proxyAddress, oldImplAddress);
  await tx.wait();

  console.log("✅ Proxy apuntado de nuevo a la implementación anterior:", oldImplAddress);
}

main().catch((error) => {
  console.error("❌ Error en rollback proxy:", error);
  process.exitCode = 1;
});
