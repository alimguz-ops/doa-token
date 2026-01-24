// scripts/addLiquidity.js
import hardhat from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Añadiendo liquidez con la cuenta:", deployer.address);

  const tokenAddress = process.env.CONTRACT_ADDRESS;
  const routerAddress = process.env.ROUTER_ADDRESS;
  const baseTokenAddress = process.env.BASE_TOKEN_ADDRESS;

  const amountToken = ethers.parseUnits(process.env.LIQ_TOKEN_AMOUNT, Number(process.env.TOKEN_DECIMALS));
  const amountBase = ethers.parseUnits(process.env.LIQ_BASE_AMOUNT, 18);
  const deadline = Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS);

  const routerAbi = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)"
  ];
  const router = new ethers.Contract(routerAddress, routerAbi, deployer);

  const erc20Abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
  const doaToken = new ethers.Contract(tokenAddress, erc20Abi, deployer);
  const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, deployer);

  console.log("✅ Aprobando DOA Token...");
  await doaToken.approve(routerAddress, amountToken);

  console.log("✅ Aprobando WMATIC...");
  await baseToken.approve(routerAddress, amountBase);

  console.log("💧 Añadiendo liquidez DOA/WMATIC...");
  const tx = await router.addLiquidity(
    tokenAddress,
    baseTokenAddress,
    amountToken,
    amountBase,
    0,
    0,
    deployer.address,
    deadline
  );

  console.log("📄 Hash de transacción:", tx.hash);
  await tx.wait();
  console.log("✅ Liquidez añadida correctamente en QuickSwap V2");
}

main().catch((error) => {
  console.error("❌ Error al añadir liquidez:", error);
  process.exitCode = 1;
});
