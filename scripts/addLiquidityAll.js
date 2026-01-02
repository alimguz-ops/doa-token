// scripts/addLiquidityAll.js
const fs = require("fs");
const { execSync } = require("child_process");

const pairs = JSON.parse(fs.readFileSync("./pairs.json", "utf8"));

for (const p of pairs) {
  console.log(`🚀 Ejecutando addLiquidity para par ${p.tokenA}/${p.tokenB}`);
  try {
    execSync(
      `node scripts/addLiquidity.js ${p.tokenA} ${p.tokenB} ${p.amountA} ${p.amountB}`,
      { stdio: "inherit" }
    );
  } catch (err) {
    console.error("❌ Error en par:", p, err.message);
  }
}
