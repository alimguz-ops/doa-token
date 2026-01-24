const fs = require("fs");
const path = require("path");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

async function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  if (!fs.existsSync(deploymentsFile)) {
    console.log("âš ï¸ No existe deployments.json todavÃ­a.");
    return;
  }

  const history = JSON.parse(fs.readFileSync(deploymentsFile, "utf-8") || "[]");
  if (history.length === 0) {
    console.log("âš ï¸ No hay despliegues registrados.");
    return;
  }

  // Datos para el grÃ¡fico
  const labels = history.map(
    (d, i) => `#${i + 1} (${new Date(d.timestamp).toISOString().split("T")[0]})`
  );
  const tokens = history.map((d) => Number(d.liquidity?.token || 0));
  const base = history.map((d) => Number(d.liquidity?.base || 0));

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

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
      scales: { y: { beginAtZero: true } },
      plugins: {
        title: { display: true, text: "Liquidez por despliegue" }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  const outputFile = path.join(process.cwd(), "liquidityChart.png");
  fs.writeFileSync(outputFile, buffer);

  console.log(`âœ… GrÃ¡fico generado en ${outputFile}`);
  console.log(`ðŸ“Š GrÃ¡fico incluye ${history.length} despliegues`);
}

main();
