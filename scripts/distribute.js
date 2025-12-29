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

  const amounts = [
    ethers.parseUnits("250000", 18), // Colaborador
    ethers.parseUnits("250000", 18), // Reserva
    ethers.parseUnits("100000", 18), // Comunidad
    ethers.parseUnits("200000", 18), // Admin
  ];

  console.log("⚙️ Ejecutando distribución inicial...");
  const tx = await doa.distributeInitial(recipients, amounts);
  console.log("📄 Hash de distribución:", tx.hash);
  await tx.wait();
  console.log("✅ Distribución completada.");
}

main().catch((e) => {
  console.error("❌ Error en distribute:", e);
  process.exitCode = 1;
});
