// scripts/deploy_and_verify_nft.js
import { ethers, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying NFT_DOA with account:", deployer.address);

  const NFT_DOA = await ethers.getContractFactory("NFT_DOA");
  const nft = await NFT_DOA.deploy();

  // ✅ Esperar confirmación de deploy
  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("✅ NFT_DOA deployed at:", address);

  // 🔒 Verificación automática en Polygonscan/Etherscan
  // Espera unos segundos para que el contrato se indexe
  await new Promise((resolve) => setTimeout(resolve, 60000));

  try {
    await run("verify:verify", {
      address,
      constructorArguments: []
    });
    console.log("🔎 Verification successful!");
  } catch (err) {
    console.error("❌ Verification failed:", err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});