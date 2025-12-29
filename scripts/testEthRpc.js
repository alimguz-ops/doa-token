// scripts/testEthRpc.js
require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Provider con ethers v5 para Ethereum mainnet
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_RPC || "https://mainnet.infura.io/v3/TU_API_KEY"
);

async function main() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Conexión exitosa al RPC de Ethereum");
    console.log("📦 Número de bloque actual:", blockNumber);
  } catch (err) {
    console.error("❌ Error de conexión al RPC Ethereum:", err);
  }
}

main();
