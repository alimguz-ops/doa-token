const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const targetAddress = "0x72851c1b53f1b369d476c1d406b65a855022f876";
  const timestamp = "22/12/2025 10:12:33";
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
