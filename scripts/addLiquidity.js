// scripts/addLiquidity.js
import hardhat from "hardhat";
import dotenv from "dotenv";

dotenv.config();
const { ethers } = hardhat;

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);

  // Selección dinámica de signer: usa OWNER por defecto
  const useAdmin = process.env.USE_ADMIN === "true";
  const privateKey = useAdmin ? process.env.PRIVATE_KEY_ADMIN : process.env.PRIVATE_KEY_OWNER;
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("🚀 Añadiendo liquidez con la cuenta:", await signer.getAddress());

  const tokenAddress = process.env.CONTRACT_ADDRESS;
  const routerAddress = process.env.ROUTER_ADDRESS;
  const baseTokenAddress = process.env.BASE_TOKEN_ADDRESS;

  if (!tokenAddress || !routerAddress || !baseTokenAddress) {
    throw new Error("❌ Faltan variables en .env");
  }

  const tokenDecimals = Number(process.env.TOKEN_DECIMALS || "18");
  const amountToken = ethers.parseUnits(process.env.LIQ_TOKEN_AMOUNT || "0", tokenDecimals);
  const amountBase = ethers.parseUnits(process.env.LIQ_BASE_AMOUNT || "0", 18);
  const deadline = Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS || "600");

  const routerAbi = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)"
  ];
  const router = new ethers.Contract(routerAddress, routerAbi, signer);

  const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
    "function allowance(address owner, address spender) public view returns (uint256)"
  ];
  const doaToken = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);

  // Verificar balances
  const doaBalance = await doaToken.balanceOf(await signer.getAddress());
  const wmaticBalance = await baseToken.balanceOf(await signer.getAddress());
  console.log("💰 Balance DOA:", ethers.formatUnits(doaBalance, tokenDecimals));
  console.log("💰 Balance WMATIC:", ethers.formatUnits(wmaticBalance, 18));

  if (doaBalance < amountToken || wmaticBalance < amountBase) {
    throw new Error("❌ Balance insuficiente para añadir liquidez");
  }

  // Verificar allowances
  const doaAllowance = await doaToken.allowance(await signer.getAddress(), routerAddress);
  const wmaticAllowance = await baseToken.allowance(await signer.getAddress(), routerAddress);
  console.log("🔎 Allowance DOA:", ethers.formatUnits(doaAllowance, tokenDecimals));
  console.log("🔎 Allowance WMATIC:", ethers.formatUnits(wmaticAllowance, 18));

  if (doaAllowance < amountToken) {
    console.log("✅ Aprobando DOA Token...");
    await (await doaToken.approve(routerAddress, amountToken)).wait();
  }

  if (wmaticAllowance < amountBase) {
    console.log("✅ Aprobando WMATIC...");
    await (await baseToken.approve(routerAddress, amountBase)).wait();
  }

  console.log("💧 Añadiendo liquidez DOA/WMATIC...");
  const tx = await router.addLiquidity(
    tokenAddress,
    baseTokenAddress,
    amountToken,
    amountBase,
    0,
    0,
    await signer.getAddress(),
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
