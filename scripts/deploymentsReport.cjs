const fs = require("fs");
const path = require("path");

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8") || "[]");
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toISOString().replace("T", " ").split(".")[0];
}

function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  const history = readJson(deploymentsFile);

  if (history.length === 0) {
    console.log("⚠️ No hay despliegues registrados todavía.");
    return;
  }

  // Mostrar tabla en consola
  console.log("\n📜 Historial de despliegues:\n");
  console.table(
    history.map((d) => ({
      Fecha: formatDate(d.timestamp),
      Red: d.network,
      Token: d.token,
      Par: d.pair,
      Router: d.router,
      Factory: d.factory,
      Reserva: d.reservePercent + "%",
      Liquidez: `${d.liquidity.token} / ${d.liquidity.base}`
    }))
  );

  // Exportar a CSV
  const headers = [
    "Fecha",
    "Red",
    "Token",
    "Par",
    "Router",
    "Factory",
    "Reserva",
    "LiquidezToken",
    "LiquidezBase"
  ];
  const rows = history.map((d) => [
    formatDate(d.timestamp),
    d.network,
    d.token,
    d.pair,
    d.router,
    d.factory,
    d.reservePercent,
    d.liquidity.token,
    d.liquidity.base
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const outputFile = path.join(process.cwd(), "deployments.csv");
  fs.writeFileSync(outputFile, csvContent);

  console.log(`\n✅ Exportado también a ${outputFile}\n`);
}

main();
