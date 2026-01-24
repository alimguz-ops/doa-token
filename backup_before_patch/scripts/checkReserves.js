// scripts/checkReserves.js
require("dotenv").config();
const { JsonRpcProvider, Contract } = require("ethers");

// ✅ Provider Polygon (v6)
const provider = new JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

async function main() {
  const pairAbi = [
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
  ];

  // Dirección del par DOA/WPOL en QuickSwap
  const pairAddr = "0x79Ea824CCC9D3CB6fdc735305e44f7Bb0Ef69799";

  const pair = new Contract(pairAddr, pairAbi, provider);

  const { reserve0, reserve1 } = await pair.getReserves();
  console.log("📊 Reserves del par DOA/WPOL:");
  console.log("reserve0:", reserve0.toString());
  console.log("reserve1:", reserve1.toString());
}

main().catch((err) => {
  console.error("❌ Error al consultar reservas:", err);
  process.exitCode = 1;
});