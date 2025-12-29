// scripts/transferToBinance.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
const senderWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

// Dirección del token que quieres transferir (ejemplo: USDT en Polygon)
const tokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDT

const binanceDepositAddress = process.env.BINANCE_ADDRESS;

const erc20Abi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const token = new ethers.Contract(tokenAddress, erc20Abi, senderWallet);

  const decimals = await token.decimals();
  const amount = ethers.parseUnits("10000", decimals); // 🔹 Ajusta la cantidad

  console.log(`🚀 Enviando ${ethers.formatUnits(amount, decimals)} USDT desde ${senderWallet.address} hacia Binance (${binanceDepositAddress})...`);
  const tx = await token.transfer(binanceDepositAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Transferencia completada. Tokens acreditados en Binance.");
}

main().catch((err) => {
  console.error("❌ Error en transferToBinance:", err);
  process.exitCode = 1;
});
