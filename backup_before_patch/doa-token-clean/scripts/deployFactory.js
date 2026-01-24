// scripts/deployFactory.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // ABI y bytecode del UniswapV2Factory
  // Asegúrate de tener el contrato en tu proyecto (ej. contracts/UniswapV2Factory.sol)
  const Factory = await ethers.getContractFactory("UniswapV2Factory");

  // El constructor de UniswapV2Factory recibe la dirección del feeToSetter
  const factory = await Factory.deploy(deployer.address);

  await factory.deployed();

  console.log("UniswapV2Factory deployed at:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
