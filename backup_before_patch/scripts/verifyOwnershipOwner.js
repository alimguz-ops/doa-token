// scripts/verifyOwnershipOwner.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.POLYGON_RPC || !process.env.PRIVATE_KEY_OWNER) {
  throw new Error("❌ Debes definir POLYGON_RPC y PRIVATE_KEY_OWNER en tu .env");
}

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

// Mensaje EXACTO que Polygonscan te pide firmar
const message =
  process.env.VERIFY_MESSAGE ||
  "[polygonscan.com 25/12/2025 00:08:02] I, hereby verify that I am the owner/creator of the address [0x6377cd174b35f3630b6d0db695f175d5f0dc5541]";

async function main() {
  try {
    if (!ethers.isAddress(wallet.address)) {
      throw new Error(`❌ Dirección inválida: ${wallet.address}`);
    }

    const signature = await wallet.signMessage(message);
    console.log("✅ Dirección:", wallet.address);
    console.log("📝 Mensaje firmado:", message);
    console.log("🔑 Signature Hash:", signature);
    console.log("🔑 Signature length:", signature.length);
  } catch (err) {
    console.error("❌ Error en verifyOwnershipOwner:", err.message);
    process.exitCode = 1;
  }
}

main();