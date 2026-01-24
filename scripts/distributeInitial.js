// scripts/distributeInitial.js
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Detectar red activa
  const network = hre.network.name;

  // Seleccionar contrato según red
  let proxyAddress;
  if (network === "mainnet") {
    proxyAddress = process.env.CONTRACT_ADDRESS_ETHEREUM;
  } else if (network === "polygon") {
    proxyAddress = process.env.CONTRACT_ADDRESS;
  } else {
    throw new Error(`❌ Red ${network} no soportada en distributeInitial.js`);
  }

  if (!proxyAddress || !ethers.isAddress(proxyAddress)) {
    throw new Error(`❌ Dirección inválida para ${network}: ${proxyAddress}`);
  }

  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);

  // --- Lista de destinatarios y montos ---
  const recipients = [
    process.env.COLLABORATOR_ADDRESS, // Colaborador
    process.env.RESERVE_ADDRESS,      // Reserva Binance
    process.env.COMMUNITY_ADDRESS,    // Comunidad
    process.env.ADMIN_ADDRESS,        // Admin
    process.env.OWNER_ADDRESS         // Owner principal
  ];

  const amounts = [
    ethers.parseUnits("250000", 18),  // Colaborador
    ethers.parseUnits("250000", 18),  // Reserva
    ethers.parseUnits("100000", 18),  // Comunidad
    ethers.parseUnits("200000", 18),  // Admin
    ethers.parseUnits("1000000", 18)  // Owner principal
  ];

  // --- Validaciones ---
  recipients.forEach((r, i) => {
    if (!ethers.isAddress(r)) {
      throw new Error(`❌ Dirección inválida en recipients[${i}]: ${r}`);
    }
  });
  if (recipients.length !== amounts.length) {
    throw new Error("❌ recipients y amounts deben tener la misma longitud");
  }

  console.log(`🚀 Ejecutando distribución inicial de DOA en red ${network}...`);
  const tx = await doa.distributeInitial(recipients, amounts);
  console.log("📄 Hash de transacción:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Distribución completada en bloque:", receipt.blockNumber);
}

main().catch((e) => {
  console.error("❌ Error en distribución:", e);
  process.exitCode = 1;
});
