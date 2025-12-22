import fs from "fs";

// Archivo de log
const logFile = "./liquidity-events.log";

// Leer archivo
if (!fs.existsSync(logFile)) {
  console.error("❌ No existe el archivo liquidity-events.log. Ejecuta listenEvents.js primero.");
  process.exit(1);
}

const lines = fs.readFileSync(logFile, "utf-8").trim().split("\n");

// Variables de acumulación
let totalAddedToken = 0n;
let totalAddedETH = 0n;
let totalRemovedLiquidity = 0n;
let addedCount = 0;
let removedCount = 0;
const tokensSummary = {};

// Procesar cada línea
for (const line of lines) {
  if (line.includes("LiquidityAdded")) {
    addedCount++;
    const tokenMatch = line.match(/Token: (\S+)/);
    const token = tokenMatch ? tokenMatch[1] : "unknown";

    const amtTokenMatch = line.match(/AmountToken: (\d+)/);
    const amtETHMatch = line.match(/AmountETH: (\d+)/);

    const amtToken = amtTokenMatch ? BigInt(amtTokenMatch[1]) : 0n;
    const amtETH = amtETHMatch ? BigInt(amtETHMatch[1]) : 0n;

    totalAddedToken += amtToken;
    totalAddedETH += amtETH;

    if (!tokensSummary[token]) {
      tokensSummary[token] = { added: 0n, removed: 0n };
    }
    tokensSummary[token].added += amtToken;
  }

  if (line.includes("LiquidityRemoved")) {
    removedCount++;
    const tokenMatch = line.match(/Token: (\S+)/);
    const token = tokenMatch ? tokenMatch[1] : "unknown";

    const liqMatch = line.match(/Liquidity: (\d+)/);
    const liquidity = liqMatch ? BigInt(liqMatch[1]) : 0n;

    totalRemovedLiquidity += liquidity;

    if (!tokensSummary[token]) {
      tokensSummary[token] = { added: 0n, removed: 0n };
    }
    tokensSummary[token].removed += liquidity;
  }
}

// Mostrar resumen
console.log("\n📊 Resumen de actividad de liquidez\n");
console.log("Operaciones de LiquidityAdded:", addedCount);
console.log("Operaciones de LiquidityRemoved:", removedCount);
console.log("Total Token añadido:", totalAddedToken.toString());
console.log("Total ETH añadido:", totalAddedETH.toString());
console.log("Total Liquidez retirada:", totalRemovedLiquidity.toString());

console.log("\n📌 Detalle por token:");
for (const [token, summary] of Object.entries(tokensSummary)) {
  console.log(`- Token ${token}: Añadido=${summary.added.toString()}, Retirado=${summary.removed.toString()}`);
}
