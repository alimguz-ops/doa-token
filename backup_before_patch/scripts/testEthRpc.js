// scripts/testEthRpc.js
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// ✅ Provider con ethers v6 para Ethereum mainnet
const provider = new ethers.JsonRpcProvider(
  process.env.ETH_RPC || "https://mainnet.infura.io/v3/TU_API_KEY"
);

async function main() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Conexión exitosa al RPC de Ethereum");
    console.log("🔗 RPC usado:", process.env.ETH_RPC || "https://mainnet.infura.io/v3/TU_API_KEY");
    console.log("📦 Número de bloque actual:", blockNumber);
  } catch (err) {
    console.error("❌ Error de conexión al RPC Ethereum:", err.message);
  }
}

main();