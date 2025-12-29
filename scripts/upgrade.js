import hardhat from "hardhat";
const { ethers, upgrades } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  const initialOwner = process.env.ADMIN_ADDRESS || "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

  if (!proxyAddress || !ethers.isAddress(proxyAddress)) {
    throw new Error(`❌ CONTRACT_ADDRESS inválido: ${proxyAddress}`);
  }
  if (!ethers.isAddress(initialOwner)) {
    throw new Error(`❌ ADMIN_ADDRESS inválido: ${initialOwner}`);
  }

  console.log("⚙️ Preparando nueva implementación DoaTokenV2...");
  const DoaTokenV2 = await ethers.getContractFactory("DoaTokenV2");
  const implAddress = await upgrades.prepareUpgrade(proxyAddress, DoaTokenV2, { kind: "transparent" });
  console.log("📍 Nueva implementación preparada en:", implAddress);

  console.log("⬆️ Ejecutando upgrade del proxy...");
  const proxy = await upgrades.upgradeProxy(proxyAddress, DoaTokenV2, { kind: "transparent" });
  console.log("✅ Proxy actualizado a DoaTokenV2. Dirección del token se mantiene:", proxyAddress);

  // Inicializar con parámetros
  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);
  console.log("⚙️ Ejecutando initializeV2() con parámetros...");
  const tx = await doa.initializeV2(
    process.env.TOKEN_NAME || "DoaToken",
    process.env.TOKEN_SYMBOL || "DOA",
    parseInt(process.env.TOKEN_DECIMALS || "18", 10),
    initialOwner
  );
  console.log("📄 Hash de inicialización:", tx.hash);
  await tx.wait();
  console.log("✅ Inicialización completada con owner:", initialOwner);
}

main().catch((e) => {
  console.error("❌ Error en upgrade:", e);
  process.exitCode = 1;
});
