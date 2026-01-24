// scripts/deploy.js (Hardhat + ethers v6)
import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  // Parámetros del inicializador
  const name = process.env.TOKEN_NAME || "DoaToken";
  const symbol = process.env.TOKEN_SYMBOL || "DOA";
  const decimals = parseInt(process.env.TOKEN_DECIMALS || "18", 10);
  const supply = BigInt(process.env.TOKEN_SUPPLY || "1000000");
  const owner = process.env.INITIAL_OWNER;

  if (!owner || !owner.startsWith("0x") || owner.length !== 42) {
    throw new Error("❌ INITIAL_OWNER inválido o no definido en .env");
  }

  const [deployerSigner] = await ethers.getSigners();
  const deployer = deployerSigner.address;

  console.log("🚀 Deploying DOA Token proxy...");
  console.log("Deployer:", deployer);
  console.log("Owner inicial:", owner);

  // Obtener la fábrica del contrato
  const DoaFactory = await ethers.getContractFactory("DoaToken");

  // Desplegar proxy con inicializador
  const doa = await upgrades.deployProxy(
    DoaFactory,
    [name, symbol, decimals, supply, owner],
    { initializer: "initialize" }
  );

  await doa.waitForDeployment();
  const proxyAddress = await doa.getAddress();

  console.log("✅ DOA Token (proxy) desplegado en:", proxyAddress);
  console.log("TX hash:", doa.deploymentTransaction().hash);

  // 📄 Registrar en deployments/deployments.json (historial)
  const deployEntry = {
    network: process.env.HARDHAT_NETWORK || "unknown",
    contract: "DOA Token",
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
}

// Ejecutar
main().catch((error) => {
  console.error("❌ Error en deploy.js:", error);
  process.exitCode = 1;
});