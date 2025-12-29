// scripts/testBalance.js
require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Provider con ethers v5
const provider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// Dirección de prueba (Owner principal)
const testAddress = process.env.OWNER_ADDRESS || "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

async function main() {
  try {
    const balance = await provider.getBalance(testAddress);
    console.log("👤 Dirección:", testAddress);
    console.log("💰 Balance MATIC:", ethers.utils.formatEther(balance));
  } catch (err) {
    console.error("❌ Error al consultar balance:", err);
  }
}

main();
