// scripts/burnByTransfer.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Wallet del Admin/Reserva
if (!process.env.PRIVATE_KEY_ADMIN) {
  throw new Error("❌ PRIVATE_KEY_ADMIN no definido en .env");
}
const burnerWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

// Dirección del contrato DOA (proxy)
if (!process.env.CONTRACT_ADDRESS || !ethers.isAddress(process.env.CONTRACT_ADDRESS)) {
  throw new Error("❌ CONTRACT_ADDRESS inválido o no definido en .env");
}
const doaAddress = process.env.CONTRACT_ADDRESS;

const erc20Abi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, burnerWallet);

  const decimals = await doaToken.decimals();
  const balance = await doaToken.balanceOf(burnerWallet.address);

  const burnAmount = process.env.BURN_AMOUNT || "100000";
  const amount = ethers.parseUnits(burnAmount, decimals);

  const deadAddress = "0x000000000000000000000000000000000000dEaD";

  console.log(`💼 Balance actual del burner: ${ethers.formatUnits(balance, decimals)} DOA`);
  console.log(`🔥 Enviando ${ethers.formatUnits(amount, decimals)} DOA al Dead Address (${deadAddress})...`);

  const tx = await doaToken.transfer(deadAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Burn completado vía transferencia. Tokens fuera de circulación.");
}

main().catch((err) => {
  console.error("❌ Error en burnByTransfer:", err.message);
  process.exitCode = 1;
});