// scripts/verifyOwnershipOwner.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

// Mensaje EXACTO que Polygonscan te pide firmar
const message = "[polygonscan.com 25/12/2025 00:08:02] I, hereby verify that I am the owner/creator of the address [0x6377cd174b35f3630b6d0db695f175d5f0dc5541]";

async function main() {
  const signature = await wallet.signMessage(message);
  console.log("✅ Dirección:", wallet.address);
  console.log("📝 Mensaje firmado:", message);
  console.log("🔑 Signature Hash:", signature);
}

main().catch(console.error);
