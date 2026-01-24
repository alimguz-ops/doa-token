// check-nonce.js
require("dotenv").config();
const { ethers } = require("ethers");

// Configuración desde .env
const RPC_URL = process.env.POLYGON_RPC;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS_SWAP_BBTC;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  // Obtener nonce actual
  const nonce = await provider.getTransactionCount(WALLET_ADDRESS, "latest");
  console.log("🔎 Nonce actual de la wallet:", WALLET_ADDRESS);
  console.log("➡️ Nonce:", nonce);
}

main().catch(err => console.error("❌ Error:", err));
