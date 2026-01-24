// scripts/testRpc.js
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// ✅ Provider con ethers v6
const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

async function main() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Conexión exitosa al RPC de Polygon");
    console.log("🔗 RPC usado:", process.env.POLYGON_RPC || "https://polygon-rpc.com");
    console.log("📦 Número de bloque actual:", blockNumber);
  } catch (err) {
    console.error("❌ Error de conexión al RPC:", err.message);
  }
}

main();