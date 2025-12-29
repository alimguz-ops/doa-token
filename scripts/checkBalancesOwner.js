// scripts/checkBalancesOwner.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// ✅ Provider compatible con ethers v6
const provider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// Dirección del contrato DOA (proxy)
const doaAddress = "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo para consultar balance
const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Dirección del Owner
const ownerAddress = "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, provider);

  const decimals = await doaToken.decimals();
  const balance = await doaToken.balanceOf(ownerAddress);

  console.log("👤 Owner:", ownerAddress);
  console.log("💰 Balance DOA:", ethers.formatUnits(balance, decimals));
}

main().catch((err) => {
  console.error("❌ Error al consultar balance:", err);
});
