import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

/**
 * Inicializa el signer con la cuenta configurada en .env
 */
export function getSigner() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
  const useAdmin = process.env.USE_ADMIN === "true";
  const privateKey = useAdmin ? process.env.PRIVATE_KEY_ADMIN : process.env.PRIVATE_KEY_OWNER;
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Crea el par DOA/WMATIC en QuickSwap Factory
 */
export async function createPair(signer) {
  const factoryAbi = [
    "function createPair(address tokenA, address tokenB) external returns (address pair)"
  ];
  const factory = new ethers.Contract(process.env.FACTORY_ADDRESS, factoryAbi, signer);

  const tokenA = process.env.CONTRACT_ADDRESS;     // DOA Token
  const tokenB = process.env.BASE_TOKEN_ADDRESS;   // WMATIC

  console.log("📄 Creando par DOA/WMATIC...");
  const tx = await factory.createPair(tokenA, tokenB);
  await tx.wait();
  console.log("✅ Par creado en QuickSwap Factory");
}

/**
 * Añade liquidez al par DOA/WMATIC en QuickSwap Router
 */
export async function addLiquidity(signer, doaAmount, wmaticAmount) {
  const routerAbi = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)"
  ];
  const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, signer);

  const tokenA = process.env.CONTRACT_ADDRESS;
  const tokenB = process.env.BASE_TOKEN_ADDRESS;

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  console.log("📄 Añadiendo liquidez...");
  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    ethers.parseUnits(doaAmount, 18),
    ethers.parseUnits(wmaticAmount, 18),
    0,
    0,
    await signer.getAddress(),
    deadline
  );
  await tx.wait();
  console.log("✅ Liquidez añadida al pool DOA/WMATIC");
}

/**
 * Remueve liquidez del par DOA/WMATIC
 */
export async function removeLiquidity(signer, liquidityAmount) {
  const routerAbi = [
    "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)"
  ];
  const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, signer);

  const tokenA = process.env.CONTRACT_ADDRESS;
  const tokenB = process.env.BASE_TOKEN_ADDRESS;

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  console.log("📄 Removiendo liquidez...");
  const tx = await router.removeLiquidity(
    tokenA,
    tokenB,
    ethers.parseUnits(liquidityAmount, 18),
    0,
    0,
    await signer.getAddress(),
    deadline
  );
  await tx.wait();
  console.log("✅ Liquidez removida del pool DOA/WMATIC");
}

/**
 * Consulta balances actuales del pool DOA/WMATIC
 */
export async function getPoolBalances(signer) {
  const pairAbi = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
  ];
  const pairAddress = process.env.PAIR_ADDRESS; // Dirección del par DOA/WMATIC
  const pair = new ethers.Contract(pairAddress, pairAbi, signer);

  const [reserve0, reserve1] = await pair.getReserves();
  console.log("📊 Balances del pool:");
  console.log("DOA:", ethers.formatUnits(reserve0, 18));
  console.log("WMATIC:", ethers.formatUnits(reserve1, 18));
}
