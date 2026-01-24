// scripts/upgrade.js
import hardhat from "hardhat";
import fs from "fs";

const { ethers, upgrades } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  const initialOwner =
    process.env.ADMIN_ADDRESS ||
    "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

  if (!proxyAddress || !ethers.isAddress(proxyAddress) || proxyAddress === ethers.ZeroAddress) {
    throw new Error(`❌ CONTRACT_ADDRESS inválido: ${proxyAddress}`);
  }
  if (!ethers.isAddress(initialOwner) || initialOwner === ethers.ZeroAddress) {
    throw new Error(`❌ ADMIN_ADDRESS inválido: ${initialOwner}`);
  }

  console.log("⚙️ Preparando nueva implementación DoaTokenV2...");
  const DoaTokenV2 = await ethers.getContractFactory("DoaTokenV2");
  const implAddress = await upgrades.prepareUpgrade(proxyAddress, DoaTokenV2, {
    kind: "transparent",
  });
  console.log("📍 Nueva implementación preparada en:", implAddress);

  console.log("⬆️ Ejecutando upgrade del proxy...");
  const proxy = await upgrades.upgradeProxy(proxyAddress, DoaTokenV2, {
    kind: "transparent",
  });
  console.log("✅ Proxy actualizado a DoaTokenV2. Dirección del token se mantiene:", proxyAddress);

  // Inicializar con parámetros
  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);
  console.log("⚙️ Ejecutando initializeV2() con parámetros...");
  try {
    const tx = await doa.initializeV2(
      process.env.TOKEN_NAME || "DoaToken",
      process.env.TOKEN_SYMBOL || "DOA",
      parseInt(process.env.TOKEN_DECIMALS || "18", 10),
      initialOwner
    );
    const receipt = await tx.wait();
    console.log(`✅ Inicialización completada con owner ${initialOwner} en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);
  } catch (err) {
    console.warn("⚠️ initializeV2 ya fue ejecutado o falló:", err.message);
  }

  // 📄 Registrar upgrade en deployments/deployments.json (historial)
  const upgradeEntry = {
    id: Date.now(), // identificador único
    network: process.env.HARDHAT_NETWORK || "unknown",
    contract: "DoaTokenV2",
    proxy: proxyAddress,
    implementation: implAddress,
    owner: initialOwner,
    updatedAt: new Date().toISOString(),
  };

  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }

  let history = [];
  const filePath = "deployments/deployments.json";
  if (fs.existsSync(filePath)) {
    try {
      history = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!Array.isArray(history)) {
        history = [history];
      }
    } catch (e) {
      console.warn("⚠️ No se pudo leer deployments.json, se reinicia historial.");
      history = [];
    }
  }

  history.push(upgradeEntry);

  try {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
    console.log("📄 Historial de upgrades actualizado en deployments/deployments.json");
  } catch (err) {
    console.error("❌ Error escribiendo deployments.json:", err.message);
  }
}

main().catch((e) => {
  console.error("❌ Error en upgrade:", e.message);
  process.exitCode = 1;
});