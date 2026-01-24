const fs = require("fs");
const path = require("path");

function readJson(file) {
  if (!fs.existsSync(file)) {
    console.error("âŒ No existe deployments.json");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, "utf-8") || "[]");
}

function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  const history = readJson(deploymentsFile);

  if (!history.length) {
    console.log("âš ï¸ No hay despliegues registrados todavÃ­a.");
    return;
  }

  // Ordenar cronolÃ³gicamente
  history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const last = history[history.length - 1];

  const liqToken = last.liquidity?.token ?? 0;
  const liqBase = last.liquidity?.base ?? 0;
  const reserve = last.reservePercent ?? "";

  console.log("ðŸ“Œ Ãšltimo despliegue registrado:");
  console.log(`- Network: ${last.network}`);
  console.log(`- Token:   ${last.token}`);
  console.log(`- Pair:    ${last.pair}`);
  console.log(`- Router:  ${last.router}`);
  console.log(`- Factory: ${last.factory}`);
  console.log(`- Liquidez: ${liqToken} tokens + ${liqBase} base`);
  console.log(`- Reserva: ${reserve}%`);
  console.log(`- Timestamp: ${new Date(last.timestamp).toLocaleString()}`);
  console.log(`ðŸ“Š Total despliegues registrados: ${history.length}`);
}

main();
