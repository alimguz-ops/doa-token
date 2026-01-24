// scripts/testBalance.js
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

// ✅ Provider con ethers v6
const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// Dirección de prueba (Owner principal)
const testAddress = process.env.OWNER_ADDRESS || "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

async function main() {
  try {
    if (!ethers.isAddress(testAddress)) {
      throw new Error("❌ Dirección inválida");
    }

    const balance = await provider.getBalance(testAddress);
    const blockNumber = await provider.getBlockNumber();

    console.log("👤 Dirección:", testAddress);
    console.log("💰 Balance MATIC:", ethers.formatEther(balance));
    console.log(`📦 Bloque actual: ${blockNumber}`);
  } catch (err) {
    console.error("❌ Error al consultar balance:", err.message);
  }
}

main();