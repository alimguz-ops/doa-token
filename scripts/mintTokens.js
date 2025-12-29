// scripts/mintTokens.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// RPC de Polygon
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Wallet con permisos de minter (Admin u Owner según el contrato)
const minterWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

// Dirección del contrato DOA (proxy)
const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo con función mint
const erc20Abi = [
  "function mint(address to, uint256 amount) public",
  "function decimals() view returns (uint8)"
];

// Dirección del Owner
const ownerAddress = "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, minterWallet);

  const decimals = await doaToken.decimals();
  const amount = ethers.parseUnits("1000000", decimals); // 1,000,000 DOA

  console.log(`🚀 Minting ${ethers.formatUnits(amount, decimals)} DOA hacia Owner (${ownerAddress})...`);
  const tx = await doaToken.mint(ownerAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();
  console.log("🎉 Mint completado. Owner ahora debe tener 1,000,000 DOA.");
}

main().catch((err) => {
  console.error("❌ Error en mint:", err);
  process.exitCode = 1;
});
