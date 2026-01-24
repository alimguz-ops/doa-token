// scripts/deploy.js (Hardhat + ethers v6 + OpenZeppelin Upgrades, CommonJS)
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  // --- Parámetros del inicializador desde .env ---
  const name = process.env.TOKEN_NAME || "DoaToken";
  const symbol = process.env.TOKEN_SYMBOL || "DOA";
  const decimals = parseInt(process.env.TOKEN_DECIMALS || "18", 10);
  const owner = process.env.OWNER_ADDRESS;  // <-- ahora lee OWNER_ADDRESS

  if (!owner || !owner.startsWith("0x") || owner.length !== 42) {
    throw new Error("❌ OWNER_ADDRESS inválido o no definido en .env");
  }

  // --- Signer de despliegue ---
  const [deployerSigner] = await ethers.getSigners();
  const deployer = deployerSigner.address;

  console.log("🚀 Deploying DOA Token V2 proxy...");
  console.log("Deployer:", deployer);
  console.log("Owner inicial:", owner);

  // --- Obtener la fábrica del contrato ---
  const DoaFactory = await ethers.getContractFactory("DoaTokenV2");

  // --- Desplegar proxy con inicializador ---
  const doa = await upgrades.deployProxy(
    DoaFactory,
    [name, symbol, decimals, owner],   // parámetros que tu initializeV2 espera
    { initializer: "initializeV2" }    // ✅ coincide con tu contrato
  );

  await doa.waitForDeployment();
  const proxyAddress = await doa.getAddress();

  console.log("✅ DOA Token V2 (proxy) desplegado en:", proxyAddress);
  console.log("TX hash:", doa.deploymentTransaction().hash);

  // --- Registrar en deployments/deployments.json ---
  const deployEntry = {
    network: process.env.HARDHAT_NETWORK || "unknown",
    contract: "DoaTokenV2",
    proxy: proxyAddress,
    deployer: deployer,
    owner: owner,
    deployedAt: new Date().toISOString(),
  };

  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }

  const filePath = "deployments/deployments.json";
  let history = [];
  if (fs.existsSync(filePath)) {
    try {
      history = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!Array.isArray(history)) {
        history = [history]; // si antes era objeto único, lo convertimos en array
      }
    } catch (e) {
      console.warn("⚠️ No se pudo leer deployments.json, se reinicia historial.");
      history = [];
    }
  }

  history.push(deployEntry);

  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
  console.log("📄 Historial de deploys actualizado en deployments/deployments.json");

  // --- Link directo a verificación en Etherscan/Polygonscan ---
  const network = process.env.HARDHAT_NETWORK || "unknown";
  if (network === "ethereum" || network === "mainnet") {
    console.log(`🔗 Verifica contrato en: https://etherscan.io/address/${proxyAddress}`);
  } else if (network === "sepolia") {
    console.log(`🔗 Verifica contrato en: https://sepolia.etherscan.io/address/${proxyAddress}`);
  } else if (network === "polygon") {
    console.log(`🔗 Verifica contrato en: https://polygonscan.com/address/${proxyAddress}`);
  } else if (network === "amoy") {
    console.log(`🔗 Verifica contrato en: https://amoy.polygonscan.com/address/${proxyAddress}`);
  }
}

// --- Ejecutar ---
main().catch((error) => {
  console.error("❌ Error en deploy.js:", error);
  process.exitCode = 1;
});
