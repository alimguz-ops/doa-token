/**
 * Script de monitoreo de liquidez para DOA
 * Envía alertas si las reservas caen por debajo del mínimo definido
 * y registra los eventos en deployments/liquidity.log
 */

const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const MIN_RESERVES = Number(process.env.MIN_RESERVES || 1000);
const LOG_FILE = "./deployments/liquidity.log";

if (isNaN(MIN_RESERVES)) {
  throw new Error("❌ MIN_RESERVES inválido en .env");
}

function logEvent(message, currentReserves) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] Reservas=${currentReserves} DOA | Min=${MIN_RESERVES} | ${message}`;
  console.log(entry);

  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments", { recursive: true });
  }

  // Rotación simple si el log supera 5 MB
  if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > 5 * 1024 * 1024) {
    fs.renameSync(LOG_FILE, LOG_FILE.replace(".log", `-${Date.now()}.log`));
  }

  fs.appendFileSync(LOG_FILE, entry + "\n");
}

function checkLiquidity(currentReserves) {
  if (currentReserves < MIN_RESERVES) {
    logEvent("⚠️ ALERTA: Reservas bajas", currentReserves);
  } else {
    logEvent("✅ OK: Reservas suficientes", currentReserves);
  }
}

// Ejemplo de ejecución (simulación)
checkLiquidity(1200);
checkLiquidity(800);