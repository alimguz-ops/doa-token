// scripts/deployFactory.js (Hardhat + ethers v6)
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying with:", deployer.address);

  // ABI y bytecode del UniswapV2Factory
  const Factory = await ethers.getContractFactory("UniswapV2Factory");

  // El constructor de UniswapV2Factory recibe la dirección del feeToSetter
  const factory = await Factory.deploy(deployer.address);

  // Esperar confirmación de despliegue
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("✅ UniswapV2Factory deployed at:", factoryAddress);
  console.log("TX hash:", factory.deploymentTransaction().hash);
}

main().catch((error) => {
  console.error("❌ Error en deployFactory.js:", error);
  process.exitCode = 1;
});