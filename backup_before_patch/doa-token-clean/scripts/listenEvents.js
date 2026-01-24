import { ethers } from "ethers";
import fs from "fs";

// Cargar configuración
const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Conectar al provider
const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// ABI del Router Mock con eventos
const routerAbi = [
  "event LiquidityAdded(address token,uint amountToken,uint amountETH,address to)",
  "event LiquidityRemoved(address token,uint liquidity,address to)"
];

// Interface para decodificar logs
const iface = new ethers.Interface(routerAbi);
const routerAddress = config.liquidity.router;

// Archivo de log
const logFile = "./liquidity-events.log";

// Función para escribir en log
function writeLog(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
}

// Mostrar mensaje inicial
console.log("\n👂 Escuchando eventos en Router Mock (Amoy)...\n");
writeLog("=== Iniciando escucha de eventos ===");

// Escuchar todos los logs del contrato
provider.on({ address: routerAddress }, (log) => {
  try {
    const parsed = iface.parseLog(log);
    const msg = `${parsed.name} | ${Object.entries(parsed.args)
      .map(([k, v]) => `${k}=${v.toString()}`)
      .join(" | ")}`;

    console.log("📊", msg);
    writeLog(msg);
  } catch (err) {
    console.error("Error parseando log:", err);
  }
});
