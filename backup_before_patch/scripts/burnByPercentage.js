// scripts/burnByPercentage.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PRIVATE_KEY_OWNER) {
  throw new Error("❌ PRIVATE_KEY_OWNER no definido en .env");
}
if (!process.env.CONTRACT_ADDRESS || !ethers.isAddress(process.env.CONTRACT_ADDRESS)) {
  throw new Error("❌ CONTRACT_ADDRESS inválido o no definido en .env");
}

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
const burnerWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, burnerWallet);

  const decimals = await doaToken.decimals();
  const balance = await doaToken.balanceOf(burnerWallet.address);

  const percentage = parseInt(process.env.BURN_PERCENTAGE || "2", 10);
  const amount = balance * BigInt(percentage) / BigInt(100);

  const deadAddress = "0x000000000000000000000000000000000000dEaD";

  console.log(`💼 Balance actual: ${ethers.formatUnits(balance, decimals)} DOA`);
  console.log(`🔥 Quemando ${ethers.formatUnits(amount, decimals)} DOA (${percentage}% del balance de ${burnerWallet.address})...`);
  console.log(`📤 Dirección destino (burn): ${deadAddress}`);

  const tx = await doaToken.transfer(deadAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Burn trimestral completado. Tokens fuera de circulación.");
}

main().catch((err) => {
  console.error("❌ Error en burnByPercentage:", err.message);
  process.exitCode = 1;
});