// scripts/deployAndLiquidity.js (Hardhat + ethers v6)
import hardhat from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy token
  const Token = await ethers.getContractFactory("DoaToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ DoaToken deployed at:", tokenAddress);

  // 2. QuickSwap V2 Router y Factory en Amoy
  const routerAddr = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // Router
  const factoryAddr = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"; // Factory
  const wmaticAddr = "0x9c3c9283d3e44854697cd22d3faa240cfb032889"; // WMATIC

  const Router = await ethers.getContractAt(
    "contracts/interfaces/IUniswapV2Router02.sol:IUniswapV2Router02",
    routerAddr
  );
  const Factory = await ethers.getContractAt(
    "contracts/interfaces/IUniswapV2Factory.sol:IUniswapV2Factory",
    factoryAddr
  );

  // 3. Crear par
  let pairAddr = await Factory.getPair(tokenAddress, wmaticAddr);
  if (pairAddr === ethers.ZeroAddress) {
    const txPair = await Factory.createPair(tokenAddress, wmaticAddr);
    await txPair.wait();
    pairAddr = await Factory.getPair(tokenAddress, wmaticAddr);
    console.log("✅ Pair created at:", pairAddr, "TX:", txPair.hash);
  } else {
    console.log("✅ Pair already exists at:", pairAddr);
  }

  // 4. Añadir liquidez
  const amountToken = ethers.parseUnits("1000000", 18); // 1M tokens
  const txApprove = await token.approve(routerAddr, amountToken);
  await txApprove.wait();
  console.log("✅ Tokens aprobados para el router. TX:", txApprove.hash);

  const deadline = Math.floor(Date.now() / 1000) + 1800; // 30 min
  const txLiquidity = await Router.addLiquidityETH(
    tokenAddress,
    amountToken,
    0,
    0,
    deployer.address,
    deadline,
    { value: ethers.parseEther("5") } // 5 MATIC
  );
  await txLiquidity.wait();
  console.log("✅ Liquidez añadida. TX:", txLiquidity.hash);

  // 5. Guardar en deployments.json (historial)
  const deploymentsPath = path.join(process.cwd(), "deployments.json");
  const entry = {
    network: "polygon-amoy",
    deployer: deployer.address,
    token: tokenAddress,
    pair: pairAddr,
    router: routerAddr,
    factory: factoryAddr,
    wmatic: wmaticAddr,
    liquidity: { tokenAmount: "1000000", baseAmount: "5" },
    timestamp: new Date().toISOString(),
  };

  let history = [];
  if (fs.existsSync(deploymentsPath)) {
    try {
      history = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
      if (!Array.isArray(history)) history = [history];
    } catch {
      history = [];
    }
  }
  history.push(entry);
  fs.writeFileSync(deploymentsPath, JSON.stringify(history, null, 2));
  console.log("📄 Deployment info appended to deployments.json");
}

main().catch((error) => {
  console.error("❌ Error in deployAndLiquidity.js:", error);
  process.exitCode = 1;
});