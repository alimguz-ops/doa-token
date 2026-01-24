// scripts/visualizeLiquidity.js
import fs from "fs";
import { spawn } from "child_process";

// Archivo de log
const logFile = "./liquidity-events.log";

// Leer archivo
if (!fs.existsSync(logFile)) {
  console.error("❌ No existe el archivo liquidity-events.log. Ejecuta listenEvents.js primero.");
  process.exit(1);
}

const lines = fs.readFileSync(logFile, "utf-8").trim().split("\n");
if (lines.length === 0) {
  console.error("⚠️ El archivo de log está vacío.");
  process.exit(1);
}

// Arrays para graficar
const timestamps = [];
const addedTokens = [];
const addedETH = [];
const removedLiquidity = [];

// Procesar cada línea
for (const line of lines) {
  // ✅ Expresión regular corregida para timestamp
  const tsMatch = line.match(/\[(.*?)\]/);
  const timestamp = tsMatch ? tsMatch[1] : "";

  if (line.includes("LiquidityAdded")) {
    const amtTokenMatch = line.match(/AmountToken: (\d+(\.\d+)?)/);
    const amtETHMatch = line.match(/AmountETH: (\d+(\.\d+)?)/);

    const amtToken = amtTokenMatch ? parseFloat(amtTokenMatch[1]) : 0;
    const amtETH = amtETHMatch ? parseFloat(amtETHMatch[1]) : 0;

    timestamps.push(timestamp);
    addedTokens.push(amtToken);
    addedETH.push(amtETH);
    removedLiquidity.push(0);
  }

  if (line.includes("LiquidityRemoved")) {
    const liqMatch = line.match(/Liquidity: (\d+(\.\d+)?)/);
    const liquidity = liqMatch ? parseFloat(liqMatch[1]) : 0;

    timestamps.push(timestamp);
    addedTokens.push(0);
    addedETH.push(0);
    removedLiquidity.push(liquidity);
  }
}

// Crear script Python para graficar
const pyCode = `
import matplotlib.pyplot as plt

timestamps = ${JSON.stringify(timestamps)}
addedTokens = ${JSON.stringify(addedTokens)}
addedETH = ${JSON.stringify(addedETH)}
removedLiquidity = ${JSON.stringify(removedLiquidity)}

plt.figure(figsize=(10,6))
plt.bar(timestamps, addedTokens, label="Tokens añadidos")
plt.bar(timestamps, addedETH, bottom=addedTokens, label="ETH añadidos")
plt.bar(timestamps, removedLiquidity, label="Liquidez retirada", color="red", alpha=0.6)

plt.xticks(rotation=45, ha="right")
plt.ylabel("Cantidad")
plt.title("Evolución de liquidez añadida y retirada")
plt.legend()
plt.tight_layout()
plt.savefig("liquidity-visualization.png")
print("✅ Gráfico guardado en liquidity-visualization.png")
`;

// Ejecutar Python
const py = spawn("python3", ["-c", pyCode]);

py.stdout.on("data", (data) => console.log(data.toString()));
py.stderr.on("data", (data) => console.error(data.toString()));
py.on("close", () => console.log("🚀 Visualización completada."));