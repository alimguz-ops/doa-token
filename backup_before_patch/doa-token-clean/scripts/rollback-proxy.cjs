require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  console.log("â™»ï¸ Rollback en Polygon/Amoy usando Proxy...");

  const proxyAddress = process.env.PROXY_ADDRESS;
  const oldImplAddress = process.env.OLD_IMPL_ADDRESS;
  const proxyAdminAddress = process.env.PROXY_ADMIN;

  if (!proxyAddress || !oldImplAddress || !proxyAdminAddress) {
    throw new Error("âŒ Faltan variables en .env: PROXY_ADDRESS, OLD_IMPL_ADDRESS, PROXY_ADMIN");
  }

  console.log("Usando configuraciÃ³n:");
  console.log(` - Proxy: ${proxyAddress}`);
  console.log(` - ImplementaciÃ³n anterior: ${oldImplAddress}`);
  console.log(` - ProxyAdmin: ${proxyAdminAddress}`);

  const proxyAdmin = await ethers.getContractAt("ProxyAdmin", proxyAdminAddress);

  const tx = await proxyAdmin.upgrade(proxyAddress, oldImplAddress);
  await tx.wait();

  console.log("âœ… Proxy apuntado de nuevo a la implementaciÃ³n anterior:", oldImplAddress);
}

main().catch((error) => {
  console.error("âŒ Error en rollback proxy:", error);
  process.exitCode = 1;
});

