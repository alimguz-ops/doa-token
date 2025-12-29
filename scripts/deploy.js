// scripts/deploy.js
import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  // Parámetros del inicializador
  const name = process.env.TOKEN_NAME || "DoaToken";
  const symbol = process.env.TOKEN_SYMBOL || "DOA";
  const decimals = parseInt(process.env.TOKEN_DECIMALS || "18", 10);
  const supply = BigInt(process.env.TOKEN_SUPPLY || "1000000");
  const owner =
    process.env.INITIAL_OWNER ||
    "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

  console.log("🚀 Deploying DOA Token proxy...");
  console.log("Owner inicial:", owner);

  // Obtener la fábrica del contrato
  const DoaFactory = await ethers.getContractFactory("DoaToken");

  // Desplegar proxy con inicializador
  const doa = await upgrades.deployProxy(
    DoaFactory,
    [name, symbol, decimals, supply, owner],
    {
      initializer: "initialize",
    }
  );

  await doa.waitForDeployment();

  const proxyAddress = await doa.getAddress();
  console.log("✅ DOA Token (proxy) desplegado en:", proxyAddress);

  // Registrar en deployments/deployments.json
  const deploymentData = {
    network: "mainnet",
    contract: "DOA Token",
    address: proxyAddress,
    proxy: proxyAddress,
    deploymentDate: new Date().toISOString(),
    status: "success",
    parameters: {
      name,
      symbol,
      decimals,
      supply: supply.toString(),
      owner,
    },
  };

  // Crear carpeta deployments si no existe
  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments");
  }

  fs.writeFileSync(
    "./deployments/deployments.json",
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("📄 Registro actualizado en deployments/deployments.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});