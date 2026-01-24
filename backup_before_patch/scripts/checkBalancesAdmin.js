// scripts/checkBalancesAdmin.js (ESM + ethers v6)
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// ✅ Provider correcto en ethers v6
const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// Dirección del contrato DOA (proxy)
const doaAddress = "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo para consultar balance
const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Dirección del Admin
const adminAddress = "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, provider);

  const decimals = await doaToken.decimals();
  const balance = await doaToken.balanceOf(adminAddress);

  console.log("👤 Admin:", adminAddress);
  console.log("💰 Balance DOA:", ethers.formatUnits(balance, decimals));
}

main().catch((err) => {
  console.error("❌ Error al consultar balance:", err);
});