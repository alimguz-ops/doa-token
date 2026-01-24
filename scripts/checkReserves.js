// scripts/checkReserves.js
require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Provider Polygon (ethers v5)
const provider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// ABI mínimo de UniswapV2Pair
const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

// Dirección del par DOA/WPOL en QuickSwap
const pairAddr = "0x79Ea824CCC9D3CB6fdc735305e44f7Bb0Ef69799";

async function main() {
  try {
    const pair = new ethers.Contract(pairAddr, pairAbi, provider);

    // Identificar tokens del par
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    // Obtener reservas
    const { reserve0, reserve1 } = await pair.getReserves();

    console.log("📊 Reservas actuales del par DOA/WPOL en QuickSwap:");
    console.log(`Token0 (${token0}): ${ethers.utils.formatUnits(reserve0, 18)}`);
    console.log(`Token1 (${token1}): ${ethers.utils.formatUnits(reserve1, 18)}`);

  } catch (err) {
    console.error("❌ Error al consultar reservas:", err);
    process.exitCode = 1;
  }
}

main();
