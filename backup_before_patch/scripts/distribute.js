// scripts/distributeInitial.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress) throw new Error("❌ Falta CONTRACT_ADDRESS en .env");

  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);

  // Normalizar direcciones
  const recipients = [
    ethers.getAddress(process.env.COLLABORATOR_ADDRESS),
    ethers.getAddress(process.env.RESERVE_ADDRESS),
    ethers.getAddress(process.env.COMMUNITY_ADDRESS),
    ethers.getAddress(process.env.ADMIN_ADDRESS),
  ];

  if (recipients.some(r => !r)) {
    throw new Error("❌ Alguna dirección de destinatario no está definida en .env");
  }

  const amounts = [
    ethers.parseUnits("250000", 18), // Colaborador
    ethers.parseUnits("250000", 18), // Reserva
    ethers.parseUnits("100000", 18), // Comunidad
    ethers.parseUnits("200000", 18), // Admin
  ];

  if (recipients.length !== amounts.length) {
    throw new Error("❌ recipients y amounts deben tener la misma longitud");
  }

  console.log("⚙️ Ejecutando distribución inicial...");
  const tx = await doa.distributeInitial(recipients, amounts);
  console.log("📄 Hash de distribución:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Distribución completada en bloque:", receipt.blockNumber);
}

main().catch((e) => {
  console.error("❌ Error en distribute:", e);
  process.exitCode = 1;
});