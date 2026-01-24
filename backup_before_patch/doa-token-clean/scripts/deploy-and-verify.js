import hardhat from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const { ethers, upgrades, run } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying with account:", deployer.address);

  const { NAME, SYMBOL, INITIALSUPPLY, OWNER, CONTRACT_NAME } = process.env;
  if (!NAME || !SYMBOL || !INITIALSUPPLY || !OWNER || !CONTRACT_NAME) {
    throw new Error("Faltan parámetros en .env: NAME, SYMBOL, INITIALSUPPLY, OWNER, CONTRACT_NAME");
  }

  // Deploy proxy con initialize
  const Token = await ethers.getContractFactory(CONTRACT_NAME);
  console.log("📦 Iniciando deploy en Polygon Amoy...");
  const token = await upgrades.deployProxy(Token, [NAME, SYMBOL, INITIALSUPPLY, OWNER], {
    initializer: "initialize",
  });

  await token.waitForDeployment();
  const proxyAddress = await token.getAddress();
  console.log("✅ Proxy deployed at:", proxyAddress);

  fs.writeFileSync(".last_deploy", proxyAddress);

 // Leer archivo .openzeppelin para obtener implementation
const ozFile = ".openzeppelin/polygonAmoy.json";
if (!fs.existsSync(ozFile)) {
  throw new Error("No se encontró el archivo .openzeppelin/polygonAmoy.json. Asegúrate de haber hecho el deploy con upgrades.");
}

const ozData = JSON.parse(fs.readFileSync(ozFile, "utf8"));

// Obtener la primera implementación registrada
const implKeys = Object.keys(ozData.impls);
if (implKeys.length === 0) {
  throw new Error("No se encontró ninguna implementación en el archivo .openzeppelin/polygonAmoy.json");
}
const implementationAddress = ozData.impls[implKeys[0]].address;

console.log("🔍 Verificando implementation contract en Polygonscan...");
console.log("Implementation:", implementationAddress);

  try {
    await run("verify:verify", {
      address: implementationAddress,
      contract: `contracts/${CONTRACT_NAME}.sol:${CONTRACT_NAME}`,
      constructorArguments: [],
    });
    console.log("✅ Verificación completada en Polygonscan");
  } catch (error) {
    console.error("❌ Error en verificación:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
