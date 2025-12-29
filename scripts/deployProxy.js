import hardhat from "hardhat";
const { ethers, upgrades } = hardhat;

async function main() {
  const name = process.env.TOKEN_NAME || "DoaToken";
  const symbol = process.env.TOKEN_SYMBOL || "DOA";
  const decimals = parseInt(process.env.TOKEN_DECIMALS || "18", 10);
  const initialSupply = ethers.parseUnits(process.env.TOKEN_SUPPLY || "1000000", decimals);
  const initialOwner = process.env.ADMIN_ADDRESS || "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

  if (!ethers.isAddress(initialOwner)) {
    throw new Error(`❌ ADMIN_ADDRESS inválido: ${initialOwner}`);
  }

  console.log("⚙️ Preparando despliegue del proxy DoaTokenV2...");
  const DoaTokenV2 = await ethers.getContractFactory("DoaTokenV2");

  // Deploy del proxy transparente con inicialización
  const proxy = await upgrades.deployProxy(
    DoaTokenV2,
    [name, symbol, decimals, initialOwner],
    { kind: "transparent", initializer: "initializeV2" }
  );

  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("✅ Proxy desplegado en:", proxyAddress);

  const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("📍 Implementación en:", implAddress);

  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
  console.log("👑 Admin del proxy:", adminAddress);
}

main().catch((e) => {
  console.error("❌ Error en deployProxy:", e);
  process.exitCode = 1;
});
