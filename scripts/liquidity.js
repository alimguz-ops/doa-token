const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("💧 Adding liquidity with account:", deployer.address);

  const doaAddress = process.env.CONTRACT_ADDRESS;
  const doa = await ethers.getContractAt(process.env.CONTRACT_NAME, doaAddress);

  const router = await ethers.getContractAt(
    "IUniswapV2Router02",
    process.env.ROUTER_ADDRESS
  );

  // Aprobar tokens al router
  const tokenAmount = ethers.parseUnits(
    process.env.LIQ_TOKEN_AMOUNT,
    process.env.TOKEN_DECIMALS
  );
  await doa.approve(process.env.ROUTER_ADDRESS, tokenAmount);

  const deadline =
    Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS);

  // Slippage: 95% mínimo aceptable
  const slippageFactor = 95; // %
  const minTokenAmount = (tokenAmount * BigInt(slippageFactor)) / BigInt(100);
  let tx;

  if (process.env.BASE_IS_NATIVE === "true") {
    // Liquidez con MATIC nativo
    const baseAmount = ethers.parseEther(process.env.LIQ_BASE_AMOUNT);
    const minBaseAmount = (baseAmount * BigInt(slippageFactor)) / BigInt(100);

    tx = await router.addLiquidityETH(
      doaAddress,
      tokenAmount,
      minTokenAmount,
      minBaseAmount,
      deployer.address,
      deadline,
      { value: baseAmount }
    );
    console.log("✅ Liquidity added with MATIC");
  } else {
    // Liquidez con ERC20 base
    const baseToken = await ethers.getContractAt(
      "IERC20",
      process.env.BASE_TOKEN_ADDRESS
    );
    const baseAmount = ethers.parseUnits(process.env.LIQ_BASE_AMOUNT, 18);
    const minBaseAmount = (baseAmount * BigInt(slippageFactor)) / BigInt(100);

    await baseToken.approve(process.env.ROUTER_ADDRESS, baseAmount);

    tx = await router.addLiquidity(
      doaAddress,
      process.env.BASE_TOKEN_ADDRESS,
      tokenAmount,
      baseAmount,
      minTokenAmount,
      minBaseAmount,
      deployer.address,
      deadline
    );
    console.log("✅ Liquidity added with ERC20 base token");
  }

  console.log("📄 Transaction hash:", tx.hash);
  await tx.wait();

  // Guardar log en JSON
  const logEntry = {
    action: "addLiquidity",
    doa: process.env.LIQ_TOKEN_AMOUNT,
    base: process.env.LIQ_BASE_AMOUNT,
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
  console.error(error);
  process.exitCode = 1;
});