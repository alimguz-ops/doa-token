import pkg from "hardhat";
import fs from "fs";

const { ethers } = pkg;

async function main() {
  // Forzar el uso de la cuenta del creador del contrato
  const signer = await ethers.getSigner("0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5");

  const targetAddress = "0x72851c1b53f1b369d476c1d406b65a855022f876";
  if (!ethers.isAddress(targetAddress)) throw new Error("❌ Dirección objetivo inválida");

  const timestamp = new Date().toISOString();
  const message = `[polygonscan.com ${timestamp}] I, hereby verify that I am the owner/creator of the address [${targetAddress}]`;

  const signature = await signer.signMessage(message);

  console.log("✅ Dirección firmante:", signer.address);
  console.log("📝 Mensaje firmado:", message);
  console.log("🔐 Hash de firma:", signature);

  try {
    fs.writeFileSync("ownership-signature.txt", signature);
    console.log("📂 Firma guardada en ownership-signature.txt");
  } catch (e) {
    console.error("❌ Error al guardar la firma:", e.message);
  }

  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(`📦 Bloque actual: ${blockNumber}`);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});