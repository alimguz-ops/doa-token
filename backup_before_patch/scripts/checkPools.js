// scripts/checkPools.js
require("dotenv").config();
const { JsonRpcProvider, Contract, formatUnits } = require("ethers");
const fs = require("fs");
const path = require("path");

// Ruta al archivo de configuración
const configPath = path.join(__dirname, "../config/polygon-mainnet.json");
const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// ✅ Provider Polygon (v6)
const provider = new JsonRpcProvider(
  cfg.POLYGON_RPC || process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// ABI de los contratos de pares y tokens ERC20
const pairAbi = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function totalSupply() view returns (uint256)"
];
const erc20Abi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

async function checkPool(symbol, pairAddress) {
  if (!pairAddress || pairAddress === "") {
    console.log(`⚠️ Pool DOA/${symbol} aún no creado.`);
    return;
  }

  try {
    const pair = new Contract(pairAddress, pairAbi, provider);
    const [t0, t1] = await Promise.all([pair.token0(), pair.token1()]);
    const { reserve0, reserve1 } = await pair.getReserves();

    const token0 = new Contract(t0, erc20Abi, provider);
    const token1 = new Contract(t1, erc20Abi, provider);

    const [sym0, sym1, dec0, dec1] = await Promise.all([
      token0.symbol(),
      token1.symbol(),
      token0.decimals(),
      token1.decimals()
    ]);

    const r0 = Number(formatUnits(reserve0, dec0));
    const r1 = Number(formatUnits(reserve1, dec1));

    console.log(`✅ Pool DOA/${symbol} (${pairAddress})`);
    console.log(`   - ${sym0}: ${r0}`);
    console.log(`   - ${sym1}: ${r1}\n`);
  } catch (err) {
    console.error(`❌ Error en pool DOA/${symbol}: ${err.message}`);
  }
}

async function main() {
  console.log("\n🔎 Monitorización de pools DOA en Polygon mainnet\n");

  const pools = {
    WMATIC: cfg.PAIR_ADDRESS_WMATIC,
    USDC: cfg.PAIR_ADDRESS_USDC,
    DAI: cfg.PAIR_ADDRESS_DAI,
    USDT: cfg.PAIR_ADDRESS_USDT
  };

  for (const [symbol, pairAddress] of Object.entries(pools)) {
    await checkPool(symbol, pairAddress);
  }

  console.log("🚀 Monitorización completa.\n");
}

main().catch((err) => {
  console.error("Error en checkPools.js:", err);
  process.exitCode = 1;
});