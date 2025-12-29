import pkg from "hardhat";
import fs from "fs";

const { ethers } = pkg;

async function main() {
  // Forzar el uso de la cuenta del creador del contrato
  const signer = await ethers.getSigner("0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5");

  const targetAddress = "0x72851c1b53f1b369d476c1d406b65a855022f876";
  const timestamp = "23/12/2025 04:58:18";
  const message = `[polygonscan.com ${timestamp}] I, hereby verify that I am the owner/creator of the address [${targetAddress}]`;

  const signature = await signer.signMessage(message);

  console.log("✅ Dirección firmante:", signer.address);
  console.log("📝 Mensaje firmado:", message);
  console.log("🔐 Hash de firma:", signature);

  fs.writeFileSync("ownership-signature.txt", signature);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
