const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("💧 Removing liquidity with account:", deployer.address);

  const router = await ethers.getContractAt(
    "IUniswapV2Router02",
    process.env.ROUTER_ADDRESS
  );

  const doaAddress = process.env.CONTRACT_ADDRESS;
  const baseTokenAddress = process.env.BASE_TOKEN_ADDRESS;

  // Cantidad de LP tokens a retirar
  const liquidityAmount = ethers.parseUnits(
    process.env.LIQ_REMOVE_AMOUNT,
    18 // LP tokens suelen tener 18 decimales
  );

  const deadline =
    Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS);

  // Slippage: 95% mínimo aceptable
  const slippageFactor = 95; // %
  const minDOA = (liquidityAmount * BigInt(slippageFactor)) / BigInt(100);
  const minBase = (liquidityAmount * BigInt(slippageFactor)) / BigInt(100);

  console.log("📄 Removing liquidity...");
  const tx = await router.removeLiquidity(
    doaAddress,
    baseTokenAddress,
    liquidityAmount,
    minDOA,
    minBase,
    deployer.address,
    deadline
  );

  console.log("📄 Transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ Liquidity removed from DOA/WMATIC pool");

  // Guardar log en JSON
  const logEntry = {
    action: "removeLiquidity",
    liquidity: process.env.LIQ_REMOVE_AMOUNT,
    txHash: tx.hash,
    account: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const logFile = "liquidity.json";
  let logs = [];
  if (fs.existsSync(logFile)) {
    logs = JSON.parse(fs.readFileSync(logFile));
  }
  logs.push(logEntry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  console.log("📝 Operation logged in liquidity.json");
}

main().catch((error) => {
  console.error("❌ Error removing liquidity:", error);
  process.exitCode = 1;
});