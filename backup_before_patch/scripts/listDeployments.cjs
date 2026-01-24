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
    console.log("âš ï¸ No hay despliegues registrados todavÃ­a.");
    return;
  }

  // Ordenar cronolÃ³gicamente
  history.sort((a, b) => a.timestamp - b.timestamp);

  console.log("\nðŸ“œ Historial de despliegues:\n");
  console.table(
    history.map((d) => ({
      Fecha: formatDate(d.timestamp),
      Red: d.network,
      Token: d.token,
      Par: d.pair,
      Router: d.router,
      Factory: d.factory,
      Reserva: (d.reservePercent ?? "") + "%",
      Liquidez: `${d.liquidity?.token ?? 0} / ${d.liquidity?.base ?? 0}`
    }))
  );

  console.log(`ðŸ“Š Total despliegues: ${history.length}`);
}

main();
