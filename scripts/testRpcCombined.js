// scripts/testRpcCombined.js
// Verifica conexión a Ethereum, Polygon y Amoy con fallback automático

require("dotenv").config();
const { ethers } = require("ethers");

async function checkRpc(name, primary, fallback) {
  console.log(`\n🔎 Probando conexión a ${name}...`);
  let provider;
  try {
    provider = new ethers.providers.JsonRpcProvider(primary);
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ ${name} RPC principal OK - Bloque: ${blockNumber}`);
    return;
  } catch (err) {
    console.warn(`⚠️ ${name} RPC principal falló: ${err.message}`);
  }

  try {
    provider = new ethers.providers.JsonRpcProvider(fallback);
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ ${name} RPC fallback OK - Bloque: ${blockNumber}`);
  } catch (err) {
    console.error(`❌ ${name} RPC fallback también falló: ${err.message}`);
  }
}

async function main() {
  await checkRpc(
    "Ethereum",
    process.env.ETH_RPC_PRIMARY || process.env.ETH_RPC,
    process.env.ETH_RPC_FALLBACK || "https://rpc.ankr.com/eth"
  );

  await checkRpc(
    "Polygon",
    process.env.POLYGON_RPC_PRIMARY || process.env.POLYGON_RPC,
    process.env.POLYGON_RPC_FALLBACK || "https://rpc.ankr.com/polygon"
  );

  await checkRpc(
    "Amoy",
    process.env.AMOY_RPC_PRIMARY || process.env.AMOY_RPC,
    process.env.AMOY_RPC_FALLBACK || "https://rpc-amoy.polygon.technology"
  );
}

main().catch((err) => {
  console.error("❌ Error general en testRpcCombined:", err);
});
