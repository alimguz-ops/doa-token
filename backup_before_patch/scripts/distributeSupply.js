// scripts/distributeSupply.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

  if (!process.env.PRIVATE_KEY_ADMIN) throw new Error("❌ Falta PRIVATE_KEY_ADMIN en .env");
  const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);
  console.log("🚀 Ejecutando distribución desde Admin:", await adminWallet.getAddress());

  const doaAddress = process.env.CONTRACT_ADDRESS;
  if (!doaAddress || !ethers.isAddress(doaAddress)) {
    throw new Error(`❌ CONTRACT_ADDRESS inválido: ${doaAddress}`);
  }

  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address account) view returns (uint256)"
  ];
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, adminWallet);

  const decimals = await doaToken.decimals();
  const amount = ethers.parseUnits(process.env.DISTRIBUTE_AMOUNT || "1000000", decimals); // 1,000,000 DOA por defecto

  const ownerAddress = "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

  console.log(`✅ Transfiriendo ${ethers.formatUnits(amount, decimals)} DOA al Owner (${ownerAddress})...`);
  const tx = await doaToken.transfer(ownerAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  const receipt = await tx.wait();
  console.log("📦 Bloque:", receipt.blockNumber);

  const balance = await doaToken.balanceOf(ownerAddress);
  console.log(`🎉 Distribución completada. Balance final del Owner: ${ethers.formatUnits(balance, decimals)} DOA`);
}

main().catch((err) => {
  console.error("❌ Error en distribución:", err);
  process.exitCode = 1;
});