// scripts/deploy-governance.js (Hardhat + ethers v6)
import hardhat from "hardhat";

const { ethers, upgrades } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with account:", deployer.address);

  // 1. Deploy DoaTokenVotes (token con gobernanza)
  const DoaTokenVotes = await ethers.getContractFactory("DoaTokenVotes");
  const doaToken = await upgrades.deployProxy(
    DoaTokenVotes,
    ["DoaToken", "DOA", 18, 1000000n, deployer.address],
    { initializer: "initialize" }
  );
  await doaToken.waitForDeployment();
  const doaTokenAddress = await doaToken.getAddress();
  console.log("✅ DoaTokenVotes deployed to:", doaTokenAddress);

  // 2. Deploy TimelockController
  const minDelay = 2 * 24 * 60 * 60; // 2 días en segundos
  const proposers = [deployer.address];
  const executors = [deployer.address];

  const TimelockController = await ethers.getContractFactory("TimelockController");
  const timelock = await TimelockController.deploy(minDelay, proposers, executors);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ TimelockController deployed to:", timelockAddress);

  // 3. Deploy DoaGovernor
  const DoaGovernor = await ethers.getContractFactory("DoaGovernor");
  const governor = await DoaGovernor.deploy(doaTokenAddress, timelockAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("✅ DoaGovernor deployed to:", governorAddress);

  // 4. Transfer ownership del token al timelock (para gobernanza real)
  const txOwnership = await doaToken.transferOwnership(timelockAddress);
  await txOwnership.wait();
  console.log("🔑 Ownership of DoaTokenVotes transferred to TimelockController");
}

main().catch((error) => {
  console.error("❌ Error en deploy-governance.js:", error);
  process.exitCode = 1;
});