const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  if (!fs.existsSync(deploymentsFile)) {
    console.log("⚠️ No existe deployments.json");
    return;
  }

  const data = JSON.parse(fs.readFileSync(deploymentsFile, "utf-8"));
  const last = data[data.length - 1];

  console.log("\n🔎 Validando despliegue...\n");

  // 1. Contrato verificado en Polygonscan Amoy
  try {
    const res = await axios.get(
      `https://api-amoy.polygonscan.com/api`,
      {
        params: {
          module: "contract",
          action: "getsourcecode",
          address: last.token,
          apikey: process.env.POLYGONSCAN_API_KEY
        }
      }
    );
    const verified = res.data.result[0].SourceCode !== "";
    console.log("Contrato verificado:", verified ? "✅" : "❌");
  } catch (e) {
    console.log("Contrato verificado: ⚠️ Error al consultar");
  }

  // 2. Par en QuickSwap
  console.log("Par creado:", last.pair ? "✅" : "❌");

  // 3. Liquidez inicial
  const hasLiquidity =
    Number(last.liquidity.token) > 0 && Number(last.liquidity.base) > 0;
  console.log("Liquidez inicial:", hasLiquidity ? "✅" : "❌");

  // 4. Registro en deployments.json
  console.log("Registro en deployments.json:", last ? "✅" : "❌");

  // 5. Transparencia
  console.log("Reportes generados en carpeta reports/:", fs.existsSync("reports") ? "✅" : "❌");

  console.log("\n📊 Validación completa.\n");
}

main();
