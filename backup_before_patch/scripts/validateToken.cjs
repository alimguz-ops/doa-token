const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

async function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  if (!fs.existsSync(deploymentsFile)) {
    console.log("âš ï¸ No existe deployments.json");
    return;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(deploymentsFile, "utf-8"));
  } catch (err) {
    console.error("âŒ Error parseando deployments.json:", err.message);
    return;
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.error("âŒ deployments.json vacÃ­o o invÃ¡lido");
    return;
  }

  const last = data[data.length - 1];

  console.log("\nðŸ”Ž Validando despliegue...\n");

  // 1. Contrato verificado en Polygonscan Amoy
  if (!ethers.isAddress(last.token)) {
    console.error("âŒ DirecciÃ³n de contrato invÃ¡lida:", last.token);
  } else {
    try {
      const res = await axios.get(`https://api-amoy.polygonscan.com/api`, {
        params: {
          module: "contract",
          action: "getsourcecode",
          address: last.token,
          apikey: process.env.POLYGONSCAN_API_KEY,
        },
      });
      const verified = res.data.result[0].SourceCode !== "";
      console.log("Contrato verificado:", verified ? "âœ…" : "âŒ");
    } catch (e) {
      console.log("Contrato verificado: âš ï¸ Error al consultar", e.response?.status || e.message);
    }
  }

  // 2. Par en QuickSwap
  console.log("Par creado:", last.pair ? "âœ…" : "âŒ");

  // 3. Liquidez inicial
  const hasLiquidity =
    last.liquidity &&
    Number(last.liquidity.token) > 0 &&
    Number(last.liquidity.base) > 0;
  console.log("Liquidez inicial:", hasLiquidity ? "âœ…" : "âŒ");

  // 4. Registro en deployments.json
  console.log("Registro en deployments.json:", last ? "âœ…" : "âŒ");

  // 5. Transparencia
  console.log("Reportes generados en carpeta reports/:", fs.existsSync("reports") ? "âœ…" : "âŒ");

  console.log("\nðŸ“Š ValidaciÃ³n completa.\n");
}

main();
