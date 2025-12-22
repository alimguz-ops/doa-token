const fs = require("fs");
const path = require("path");

function readJson(file) {
  if (!fs.existsSync(file)) {
    console.error("No existe deployments.json");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, "utf-8") || "[]");
}

function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  const history = readJson(deploymentsFile);

  if (!history.length) {
    console.log("No hay despliegues registrados todavía.");
    return;
  }

  const last = history[history.length - 1];
  console.log("📌 Último despliegue registrado:");
  console.log(`- Network: ${last.network}`);
  console.log(`- Token:   ${last.token}`);
  console.log(`- Pair:    ${last.pair}`);
  console.log(`- Router:  ${last.router}`);
  console.log(`- Factory: ${last.factory}`);
  console.log(`- Liquidez: ${last.liquidity.token} tokens + ${last.liquidity.base} base`);
  console.log(`- Reserva: ${last.reservePercent}%`);
  console.log(`- Timestamp: ${new Date(last.timestamp).toLocaleString()}`);
}

main();
