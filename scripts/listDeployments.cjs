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
}

main();
