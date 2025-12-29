// scripts/testRpc.js
require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Provider con ethers v5
const provider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

async function main() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Conexión exitosa al RPC de Polygon");
    console.log("📦 Número de bloque actual:", blockNumber);
  } catch (err) {
    console.error("❌ Error de conexión al RPC:", err);
  }
}

main();
