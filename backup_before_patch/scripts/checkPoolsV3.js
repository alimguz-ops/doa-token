// scripts/checkPoolsV3.js (ESM + ethers v6)
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// ✅ Provider Polygon (v6)
const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// ABI mínima de Uniswap v3 pool
const v3PoolAbi = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function fee() view returns (uint24)",
  "function liquidity() view returns (uint128)",
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
];

const erc20Abi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

async function checkPoolV3(poolAddress) {
  try {
    const pool = new ethers.Contract(poolAddress, v3PoolAbi, provider);

    const [t0, t1, fee, liquidity, slot0] = await Promise.all([
      pool.token0(),
      pool.token1(),
      pool.fee(),
      pool.liquidity(),
      pool.slot0()
    ]);

    const token0 = new ethers.Contract(t0, erc20Abi, provider);
    const token1 = new ethers.Contract(t1, erc20Abi, provider);

    const [sym0, sym1, dec0, dec1] = await Promise.all([
      token0.symbol(),
      token1.symbol(),
      token0.decimals(),
      token1.decimals()
    ]);

    // Precio aproximado usando sqrtPriceX96
    const sqrtPriceX96 = slot0[0];
    const price = (Number(sqrtPriceX96) ** 2) / 2 ** 192;
    const adjustedPrice = price * (10 ** dec0 / 10 ** dec1);

    console.log(`✅ Pool ${sym0}/${sym1} (${poolAddress})`);
    console.log(`   - Fee tier: ${fee / 10000}%`);
    console.log(`   - Liquidez: ${liquidity.toString()}`);
    console.log(`   - Precio ${sym0}/${sym1}: ${adjustedPrice}\n`);
  } catch (err) {
    console.error(`❌ Error en pool v3 ${poolAddress}: ${err.message}`);
  }
}

async function main() {
  console.log("\n🔎 Monitorización de pools DOA en Uniswap v3 (Polygon)\n");

  // Dirección del pool DOA/WMATIC v3 0.3%
  const poolDOAWMATIC = "0x79Ea824CCC9D3CB6fdc735305e44f7Bb0Ef69799";

  await checkPoolV3(poolDOAWMATIC);

  console.log("🚀 Monitorización v3 completa.\n");
}

main().catch((err) => {
  console.error("Error en checkPoolsV3.js:", err);
  process.exitCode = 1;
});