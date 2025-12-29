import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress || !ethers.isAddress(proxyAddress)) {
    throw new Error(`❌ CONTRACT_ADDRESS inválido: ${proxyAddress}`);
  }

  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);

  // Lista final de destinatarios y montos
  const recipients = [
    "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1", // Colaborador (Metamax)
    "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95", // Reserva (Binance)
    "0xD1f7a79CE44b267Dfe51B6F84008208550a30562", // Equipo comunidad / Constructor (Metamax)
    "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5"  // Admin (OKX)
  ];

  const amounts = [
    ethers.parseUnits("150000", 18), // Colaborador
    ethers.parseUnits("250000", 18), // Reserva
    ethers.parseUnits("100000", 18), // Equipo comunidad
    ethers.parseUnits("200000", 18)  // Admin
  ];

  console.log("🚀 Ejecutando distribución inicial de DOA...");
  const tx = await doa.distributeInitial(recipients, amounts);
  console.log("📄 Hash de transacción:", tx.hash);
  await tx.wait();
  console.log("✅ Distribución completada. Suministro total emitido y asignado.");
}

main().catch((e) => {
  console.error("❌ Error en distribución:", e);
  process.exitCode = 1;
});
