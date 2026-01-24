import { ethers } from "ethers";
import fs from "fs";

// Flag de red (ejemplo: polygon-amoy, polygon-mainnet)
const networkFlag = process.argv[2] ?? "polygon-amoy";
const configPath = new URL(`../config/${networkFlag}.json`, import.meta.url);

if (!fs.existsSync(configPath)) {
  console.error(`❌ Config file not found: ${configPath.pathname}`);
  process.exit(1);
}

// Cargar configuración
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (err) {
  throw new Error(`❌ Error parseando config: ${err.message}`);
}

console.log(`\n🔎 Validando reservas en ${config.network}...\n`);

const provider = new ethers.JsonRpcProvider(config.rpcUrl);

const abiPair = [
  "function getReserves() view returns (uint112,uint112,uint32)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

if (!ethers.isAddress(config.liquidity.pairAddress) || !ethers.isAddress(config.token.address)) {
  throw new Error("❌ Dirección inválida en config.json");
}

const pair = new ethers.Contract(config.liquidity.pairAddress, abiPair, provider);

const [reserve0, reserve1, blockTimestampLast] = await pair.getReserves();
const token0 = await pair.token0();
const token1 = await pair.token1();

let tokenReserve, maticReserve;
if (token0.toLowerCase() === config.token.address.toLowerCase()) {
  tokenReserve = reserve0;
  maticReserve = reserve1;
} else {
  tokenReserve = reserve1;
  maticReserve = reserve0;
}

console.log("✅ Reservas actuales:");
console.log("   Token:", ethers.formatUnits(tokenReserve, config.token.decimals));
console.log("   WMATIC:", ethers.formatUnits(maticReserve, 18));
console.log(`🔗 Par tokens: ${token0} / ${token1}`);
console.log(`🕒 Último bloque de actualización: ${blockTimestampLast}`);

if (tokenReserve > 0n && maticReserve > 0n) {
  console.log("\n📊 Liquidez disponible: ✅ El par está operativo.\n");
} else {
  console.log("\n⚠️ Liquidez insuficiente: ❌ No se puede operar correctamente.\n");
}