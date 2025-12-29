// scripts/burnByPercentage.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Wallet que ejecuta el burn (Owner o Admin según estrategia)
const burnerWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

// Dirección del contrato DOA (proxy)
const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo ERC20
const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, burnerWallet);

  const decimals = await doaToken.decimals();
  const balance = await doaToken.balanceOf(burnerWallet.address);

  // 🔥 Ajusta el porcentaje aquí (ejemplo: 2%)
  const percentage = 2;
  const amount = balance * BigInt(percentage) / BigInt(100);

  const deadAddress = "0x000000000000000000000000000000000000dEaD";

  console.log(`🔥 Quemando ${ethers.formatUnits(amount, decimals)} DOA (${percentage}% del balance de ${burnerWallet.address})...`);
  const tx = await doaToken.transfer(deadAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Burn trimestral completado. Tokens fuera de circulación.");
}

main().catch((err) => {
  console.error("❌ Error en burnByPercentage:", err);
  process.exitCode = 1;
});
