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

  // Datos para el gráfico
  const labels = history.map((d, i) => `#${i + 1} (${new Date(d.timestamp).toLocaleDateString()})`);
  const tokens = history.map((d) => Number(d.liquidity.token));
  const base = history.map((d) => Number(d.liquidity.base));

  const width = 800;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Tokens",
          data: tokens,
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
          label: "Base (MATIC)",
          data: base,
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: "Liquidez por despliegue"
        }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  const outputFile = path.join(process.cwd(), "liquidityChart.png");
  fs.writeFileSync(outputFile, buffer);
  console.log(`✅ Gráfico generado en ${outputFile}`);
}

main();
