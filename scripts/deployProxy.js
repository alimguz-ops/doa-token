// scripts/deployProxyDoaTokenV2.js
import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  const name = process.env.TOKEN_NAME || "DoaToken";
  const symbol = process.env.TOKEN_SYMBOL || "DOA";
  const decimals = parseInt(process.env.TOKEN_DECIMALS || "18", 10);
  const supplyRaw = process.env.TOKEN_SUPPLY || "1000000";

  if (isNaN(Number(supplyRaw))) {
    throw new Error("❌ TOKEN_SUPPLY inválido en .env");
  }

  const initialSupply = ethers.utils.parseUnits(supplyRaw, decimals);
  const initialOwner =
    process.env.ADMIN_ADDRESS || "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

  if (!ethers.utils.isAddress(initialOwner)) {
    throw new Error(`❌ ADMIN_ADDRESS inválido: ${initialOwner}`);
  }

  console.log("⚙️ Preparando despliegue del proxy DoaTokenV2...");
  console.log(
    `📄 Parámetros: name=${name}, symbol=${symbol}, decimals=${decimals}, supply=${ethers.utils.formatUnits(
      initialSupply,
      decimals
    )}, owner=${initialOwner}`
  );

  const DoaTokenV2 = await ethers.getContractFactory("DoaTokenV2");

  // Ajusta los parámetros según tu inicializador
  const proxy = await upgrades.deployProxy(
    DoaTokenV2,
    [name, symbol, decimals, initialSupply, initialOwner],
    { kind: "transparent", initializer: "initializeV2" }
  );

  await proxy.deployed();
  console.log("✅ Proxy desplegado en:", proxy.address);

  const implAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
  console.log("📍 Implementación en:", implAddress);

  const adminAddress = await upgrades.erc1967.getAdminAddress(proxy.address);
  console.log("👑 Admin del proxy:", adminAddress);

  // Guardar en deployments.json
  const deploymentsFile = "deployments.json";
  let deployments = {};
  if (fs.existsSync(deploymentsFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsFile));
  }
  deployments["DOA_V2"] = {
    proxy: proxy.address,
    implementation: implAddress,
    admin: adminAddress,
    network: process.env.HARDHAT_NETWORK || "mainnet",
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(deploymentsFile, JSON.stringify(deployments, null, 2));

  console.log("📑 Datos guardados en deployments.json");
}

main().catch((err) => {
  console.error("❌ Error en deployProxy:", err);
  process.exitCode = 1;
});
