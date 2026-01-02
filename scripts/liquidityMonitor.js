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

function logEvent(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  console.log(entry);

  // Crear carpeta deployments si no existe
  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments", { recursive: true });
  }

  // Registrar en liquidity.log
  fs.appendFileSync(LOG_FILE, entry + "\n");
}

function checkLiquidity(currentReserves) {
  if (currentReserves < MIN_RESERVES) {
    logEvent(`⚠️ ALERTA: Reservas bajas (${currentReserves} DOA)`);
  } else {
    logEvent(`✅ OK: Reservas actuales ${currentReserves} DOA`);
  }
}

// Ejemplo de ejecución (simulación)
checkLiquidity(1200);
checkLiquidity(800);
