// scripts/burnByTransfer.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Usa la cuenta que tenga tokens (Admin, Reserva, etc.)
const burnerWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

const erc20Abi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, burnerWallet);

  const decimals = await doaToken.decimals();
  const amount = ethers.parseUnits("100000", decimals); // 🔥 cantidad a quemar

  const deadAddress = "0x000000000000000000000000000000000000dEaD";

  console.log(`🔥 Enviando ${ethers.formatUnits(amount, decimals)} DOA al Dead Address (${deadAddress})...`);
  const tx = await doaToken.transfer(deadAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Burn completado vía transferencia. Tokens fuera de circulación.");
}

main().catch((err) => {
  console.error("❌ Error en burnByTransfer:", err);
  process.exitCode = 1;
});
