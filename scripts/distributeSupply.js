// scripts/distributeSupply.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
  const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

  console.log("🚀 Ejecutando distribución desde Admin:", await adminWallet.getAddress());

  const doaAddress = process.env.CONTRACT_ADDRESS;
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() view returns (uint8)"
  ];
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, adminWallet);

  const decimals = await doaToken.decimals();
  const amount = ethers.parseUnits("1000000", decimals); // 1,000,000 DOA

  const ownerAddress = "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

  console.log(`✅ Transfiriendo ${ethers.formatUnits(amount, decimals)} DOA al Owner (${ownerAddress})...`);
  const tx = await doaToken.transfer(ownerAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Distribución completada. Owner ahora debe tener 1,000,000 DOA.");
}

main().catch((err) => {
  console.error("❌ Error en distribución:", err);
  process.exitCode = 1;
});
