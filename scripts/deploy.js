// scripts/deploy.js
import hardhat from "hardhat";

const { ethers, upgrades } = hardhat;

async function main() {
  const DoaToken = await ethers.getContractFactory("DoaToken");

  const name = "DOA Token";
  const symbol = "DOA";
  const decimals = 18;
  const initialSupply = 1_000_000;

  const [deployer] = await ethers.getSigners();
  const owner = deployer.address;

  console.log("🚀 Deploying DOA Token proxy with account:", deployer.address);

  const doaToken = await upgrades.deployProxy(
    DoaToken,
    [name, symbol, decimals, initialSupply, owner],
    {
      initializer: "initialize",
      gasLimit: 6000000,
      maxFeePerGas: ethers.parseUnits("80", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    }
  );

  await doaToken.waitForDeployment();

  // 🔑 imprime hash y dirección del contrato
  console.log("📄 Transaction hash:", doaToken.deployTransaction.hash);
  console.log("✅ DOA Token proxy deployed to:", await doaToken.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
