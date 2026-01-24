import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const { ethers, upgrades, run } = hardhat;

async function deploy() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying with account:", deployer.address);

  const { NAME, SYMBOL, INITIALSUPPLY, OWNER, CONTRACT_NAME } = process.env;
  if (!NAME || !SYMBOL || !INITIALSUPPLY || !OWNER || !CONTRACT_NAME) {
    throw new Error("❌ Faltan parámetros en .env: NAME, SYMBOL, INITIALSUPPLY, OWNER, CONTRACT_NAME");
  }

  const Token = await ethers.getContractFactory(CONTRACT_NAME);
  console.log("📦 Iniciando deploy en Polygon Amoy...");
  const token = await upgrades.deployProxy(Token, [NAME, SYMBOL, INITIALSUPPLY, OWNER], {
    initializer: "initialize",
  });

  await token.waitForDeployment();
  const proxyAddress = await token.getAddress();
  console.log("✅ Proxy deployed at:", proxyAddress);

  fs.writeFileSync(".last_deploy", `${hardhat.network.name}:${proxyAddress}`);

  await verifyImplementation(CONTRACT_NAME);
}

async function upgrade() {
  const [deployer] = await ethers.getSigners();
  console.log("🔧 Upgrading with account:", deployer.address);

  const { CONTRACT_NAME } = process.env;
  if (!CONTRACT_NAME) throw new Error("❌ Falta CONTRACT_NAME en .env");

  if (!fs.existsSync(".last_deploy")) throw new Error("❌ No se encontró .last_deploy con la dirección del proxy.");
  const [networkName, proxyAddress] = fs.readFileSync(".last_deploy", "utf8").trim().split(":");
  console.log("📦 Proxy a actualizar:", proxyAddress);

  const Token = await ethers.getContractFactory(CONTRACT_NAME);
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Token);

  await upgraded.waitForDeployment();
  console.log("✅ Upgrade completado en proxy:", await upgraded.getAddress());

  await verifyImplementation(CONTRACT_NAME);
}

async function rollback() {
  const [deployer] = await ethers.getSigners();
  console.log("⚠️ Rollback iniciado con la cuenta:", deployer.address);

  if (!fs.existsSync(".last_deploy")) throw new Error("❌ No se encontró .last_deploy con la dirección del proxy.");
  const [networkName, proxyAddress] = fs.readFileSync(".last_deploy", "utf8").trim().split(":");
  console.log("📦 Proxy a revertir:", proxyAddress);

  const ozFile = `.openzeppelin/${networkName}.json`;
  if (!fs.existsSync(ozFile)) throw new Error(`❌ No se encontró el archivo ${ozFile}.`);

  const ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));
  const implKeys = Object.keys(ozData.impls);
  if (implKeys.length < 2) throw new Error("❌ No hay suficientes implementaciones para hacer rollback.");

  const previousImplKey = implKeys[implKeys.length - 2];
  const previousImplAddress = ozData.impls[previousImplKey].address;

  if (!ethers.isAddress(previousImplAddress)) {
    throw new Error(`❌ Dirección inválida de implementación anterior: ${previousImplAddress}`);
  }

  console.log("🔙 Restaurando implementación anterior:", previousImplAddress);

  const admin = await upgrades.admin.getInstance();
  await admin.changeProxyImplementation(proxyAddress, previousImplAddress);

  console.log("✅ Rollback completado. Proxy ahora apunta a:", previousImplAddress);
}

async function verifyImplementation(contractName) {
  const networkName = hardhat.network.name;
  const ozFile = `.openzeppelin/${networkName}.json`;
  if (!fs.existsSync(ozFile)) throw new Error(`❌ No se encontró el archivo ${ozFile}.`);

  const ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));
  const implKeys = Object.keys(ozData.impls);
  if (implKeys.length === 0) throw new Error("❌ No se encontró ninguna implementación en el archivo .openzeppelin.");
  const implementationAddress = ozData.impls[implKeys[implKeys.length - 1]].address;

  console.log("🔍 Verificando implementation contract en Polygonscan...");
  console.log("Implementation:", implementationAddress);

  try {
    await run("verify:verify", {
      address: implementationAddress,
      contract: `contracts/${contractName}.sol:${contractName}`,
      constructorArguments: [],
    });
    console.log("✅ Verificación completada en Polygonscan");
  } catch (err) {
    console.error("❌ Error en verificación:", err);
  }
}

async function main() {
  const action = process.env.ACTION; // "deploy", "upgrade", "rollback"
  if (!action) throw new Error("❌ Falta ACTION en .env (usa 'deploy', 'upgrade' o 'rollback')");

  if (action === "deploy") await deploy();
  else if (action === "upgrade") await upgrade();
  else if (action === "rollback") await rollback();
  else throw new Error(`❌ Acción desconocida: ${action}`);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});