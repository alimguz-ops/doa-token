/**
 * Script de monitoreo de liquidez para DOA/WPOL
 * - Consulta reservas reales del par en QuickSwap
 * - Envía alertas si caen por debajo del mínimo definido
 * - Registra eventos en deployments/liquidity.log
 */

const fs = require("fs");
const dotenv = require("dotenv");
const { ethers } = require("ethers");

dotenv.config();

// Configuración desde .env
const RPC_URL = process.env.POLYGON_RPC || "https://polygon-rpc.com";
const PAIR_ADDR = process.env.PAIR_ADDR || "0x79Ea824CCC9D3CB6fdc735305e44f7Bb0Ef69799"; // LP DOA/WPOL
const MIN_RESERVES = Number(process.env.MIN_RESERVES || 1000); // mínimo DOA
const LOG_FILE = process.env.LOG_FILE || "./deployments/liquidity.log";
const INTERVAL = Number(process.env.CHECK_INTERVAL || 300000); // cada 5 min por defecto

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

function logEvent(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  console.log(entry);

  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments", { recursive: true });
  }
  fs.appendFileSync(LOG_FILE, entry + "\n");
}

async function checkLiquidity() {
  try {
    const pair = new ethers.Contract(PAIR_ADDR, pairAbi, provider);
    const [reserve0, reserve1] = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    const res0 = Number(ethers.utils.formatUnits(reserve0, 18));
    const res1 = Number(ethers.utils.formatUnits(reserve1, 18));

    logEvent(`📊 Estado actual del pool: 
      Token0 (${token0}) → ${res0}
      Token1 (${token1}) → ${res1}`);

    if (res1 < MIN_RESERVES) {
      logEvent(`⚠️ ALERTA: Reservas bajas (${res1} DOA)`);
    } else {
      logEvent(`✅ OK: Reservas actuales ${res1} DOA`);
    }
  } catch (err) {
    logEvent(`❌ Error al consultar reservas: ${err.message}`);
  }
}

logEvent("🚀 Monitor de liquidez iniciado...");
checkLiquidity();
setInterval(checkLiquidity, INTERVAL);

// --- Control por variable MONITOR_ENABLED ---
if (process.env.MONITOR_ENABLED === "true") {
  logEvent("🚀 Monitor de liquidez activado...");
  checkLiquidity();
  setInterval(checkLiquidity, INTERVAL);
} else {
  logEvent("⏸️ Monitor de liquidez desactivado por configuración (.env)");
}
