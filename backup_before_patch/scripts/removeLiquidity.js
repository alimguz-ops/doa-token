const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("💧 Removing liquidity with account:", deployer.address);

  if (!process.env.ROUTER_ADDRESS || !process.env.CONTRACT_ADDRESS || !process.env.BASE_TOKEN_ADDRESS) {
    throw new Error("❌ Faltan variables de entorno necesarias");
  }

  const router = await ethers.getContractAt(
    "IUniswapV2Router02",
    process.env.ROUTER_ADDRESS
  );

  const doaAddress = process.env.CONTRACT_ADDRESS;
  const baseTokenAddress = process.env.BASE_TOKEN_ADDRESS;

  const liquidityAmount = ethers.parseUnits(
    process.env.LIQ_REMOVE_AMOUNT,
    18
  );

  const deadline =
    Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS || "1800");

  console.log("📄 Removing liquidity...");

  // Si el par es DOA/WMATIC, usar removeLiquidityETH
  const tx = await router.removeLiquidityETH(
    doaAddress,
    liquidityAmount,
    0, // minDOA
    0, // minBase
    deployer.address,
    deadline
  );

  console.log("📄 Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log(`✅ Liquidity removed from DOA/WMATIC pool en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);

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
    logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
  }
  logs.push(logEntry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  console.log("📝 Operation logged in liquidity.json");
}

main().catch((error) => {
  console.error("❌ Error removing liquidity:", error);
  process.exitCode = 1;
});