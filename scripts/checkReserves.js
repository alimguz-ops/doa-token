// scripts/checkReserves.js
import dotenv from "dotenv";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";

dotenv.config();

// ✅ Provider dinámico según red
const rpcUrl =
  process.env.ETH_RPC || process.env.POLYGON_RPC || "https://polygon-rpc.com";
const provider = new JsonRpcProvider(rpcUrl);

// ABI mínimo de UniswapV2Pair
const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

// Dirección del par (ajusta según red)
const pairAddr =
  process.env.PAIR_ADDRESS ||
  "0xF526487FE9518a2D7bfB2199445d4fE5D6cF02F1"; // ejemplo: DOA/WETH en Ethereum

async function main() {
  try {
    const pair = new Contract(pairAddr, pairAbi, provider);

    // Identificar tokens del par
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    // Obtener reservas
    const { reserve0, reserve1 } = await pair.getReserves();

    console.log("📊 Reservas actuales del par:");
    console.log(`Token0 (${token0}): ${formatUnits(reserve0, 18)}`);
    console.log(`Token1 (${token1}): ${formatUnits(reserve1, 18)}`);
  } catch (err) {
    console.error("❌ Error al consultar reservas:", err);
    process.exitCode = 1;
  }
}

main();
