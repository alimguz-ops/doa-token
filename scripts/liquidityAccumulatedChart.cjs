const fs = require("fs");
const path = require("path");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

async function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  if (!fs.existsSync(deploymentsFile)) {
    console.log("⚠️ No existe deployments.json todavía.");
    return;
  }

  const history = JSON.parse(fs.readFileSync(deploymentsFile, "utf-8") || "[]");
  if (history.length === 0) {
    console.log("⚠️ No hay despliegues registrados.");
    return;
  }

  // Ordenar por fecha
  history.sort((a, b) => a.timestamp - b.timestamp);

  // Calcular acumulados
  let accTokens = 0;
  let accBase = 0;
  const labels = [];
  const tokensAccum = [];
  const baseAccum = [];

  for (const d of history) {
    accTokens += Number(d.liquidity.token);
    accBase += Number(d.liquidity.base);
    labels.push(new Date(d.timestamp).toLocaleDateString());
    tokensAccum.push(accTokens);
    baseAccum.push(accBase);
  }

  const width = 800;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const config = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Tokens acumulados",
          data: tokensAccum,
          borderColor: "rgba(54, 162, 235, 0.8)",
          fill: false
        },
        {
          label: "Base (MATIC) acumulada",
          data: baseAccum,
          borderColor: "rgba(255, 99, 132, 0.8)",
          fill: false
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: "Liquidez acumulada por despliegue"
        }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  const outputFile = path.join(process.cwd(), "liquidityAccumulatedChart.png");
  fs.writeFileSync(outputFile, buffer);
  console.log(`✅ Gráfico acumulado generado en ${outputFile}`);
}

main();
