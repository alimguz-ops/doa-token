import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);

  const useAdmin = process.env.USE_ADMIN === "true";
  const privateKey = useAdmin ? process.env.PRIVATE_KEY_ADMIN : process.env.PRIVATE_KEY_OWNER;
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("🚀 Ejecutando con la cuenta:", await signer.getAddress());

  // --- Factory: Crear par DOA/WMATIC ---
  const factoryAbi = [
    "function createPair(address tokenA, address tokenB) external returns (address pair)"
  ];
  const factory = new ethers.Contract(process.env.FACTORY_ADDRESS, factoryAbi, signer);

  const tokenA = process.env.CONTRACT_ADDRESS;     // DOA Token
  const tokenB = process.env.BASE_TOKEN_ADDRESS;   // WMATIC

  console.log("📄 Creando par DOA/WMATIC...");
  const txPair = await factory.createPair(tokenA, tokenB);
  await txPair.wait();
  console.log("✅ Par creado en QuickSwap Factory");

  // --- Router: Añadir liquidez ---
  const routerAbi = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)"
  ];
  const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, signer);

  const doaAmount = ethers.parseUnits("1000000", 18); // 1,000,000 DOA
  const wmaticAmount = ethers.parseUnits("50", 18);   // 50 WMATIC

  console.log("📄 Añadiendo liquidez inicial...");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos
  const txLiquidity = await router.addLiquidity(
    tokenA,
    tokenB,
    doaAmount,
    wmaticAmount,
    0,
    0,
    await signer.getAddress(),
    deadline
  );
  await txLiquidity.wait();
  console.log("✅ Liquidez añadida al pool DOA/WMATIC");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
