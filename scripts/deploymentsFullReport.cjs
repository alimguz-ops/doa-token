const fs = require("fs");
const path = require("path");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8") || "[]");
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toISOString().replace("T", " ").split(".")[0];
}

async function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  const history = readJson(deploymentsFile);

  if (history.length === 0) {
    console.log("⚠️ No hay despliegues registrados todavía.");
    return;
  }

  // Crear carpeta reports si no existe
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

  // Nombre de subcarpeta con fecha/hora
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportFolder = path.join(reportsDir, `report-${timestamp}`);
  fs.mkdirSync(reportFolder);

  // --- 1. Mostrar tabla en consola ---
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

  // --- 2. Exportar a CSV ---
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
  const csvFile = path.join(reportFolder, "deployments.csv");
  fs.writeFileSync(csvFile, csvContent);
  console.log(`✅ Exportado también a ${csvFile}`);

  // --- 3. Gráfico de barras ---
  const labels = history.map((d, i) => `#${i + 1} (${new Date(d.timestamp).toLocaleDateString()})`);
  const tokens = history.map((d) => Number(d.liquidity.token));
  const base = history.map((d) => Number(d.liquidity.base));

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });
  const barConfig = {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Tokens", data: tokens, backgroundColor: "rgba(54, 162, 235, 0.6)" },
        { label: "Base (MATIC)", data: base, backgroundColor: "rgba(255, 99, 132, 0.6)" }
      ]
    },
    options: { plugins: { title: { display: true, text: "Liquidez por despliegue" } } }
  };
  const barBuffer = await chartJSNodeCanvas.renderToBuffer(barConfig);
  fs.writeFileSync(path.join(reportFolder, "liquidityChart.png"), barBuffer);
  console.log("✅ Gráfico de barras generado en carpeta de reporte");

  // --- 4. Gráfico acumulado ---
  history.sort((a, b) => a.timestamp - b.timestamp);
  let accTokens = 0, accBase = 0;
  const accLabels = [], tokensAccum = [], baseAccum = [];
  for (const d of history) {
    accTokens += Number(d.liquidity.token);
    accBase += Number(d.liquidity.base);
    accLabels.push(new Date(d.timestamp).toLocaleDateString());
    tokensAccum.push(accTokens);
    baseAccum.push(accBase);
  }
  const lineConfig = {
    type: "line",
    data: {
      labels: accLabels,
      datasets: [
        { label: "Tokens acumulados", data: tokensAccum, borderColor: "rgba(54, 162, 235, 0.8)", fill: false },
        { label: "Base (MATIC) acumulada", data: baseAccum, borderColor: "rgba(255, 99, 132, 0.8)", fill: false }
      ]
    },
    options: { plugins: { title: { display: true, text: "Liquidez acumulada" } } }
  };
  const lineBuffer = await chartJSNodeCanvas.renderToBuffer(lineConfig);
  fs.writeFileSync(path.join(reportFolder, "liquidityAccumulatedChart.png"), lineBuffer);
  console.log("✅ Gráfico acumulado generado en carpeta de reporte");

  console.log(`\n📂 Reporte completo guardado en: ${reportFolder}\n`);
}

main();
