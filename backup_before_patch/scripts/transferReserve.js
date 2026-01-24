import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  const reserveAddress = process.env.RESERVE_ADDRESS;

  if (!proxyAddress || !reserveAddress) {
    throw new Error("❌ Debes definir CONTRACT_ADDRESS y RESERVE_ADDRESS en tu .env");
  }
  if (!ethers.isAddress(proxyAddress) || !ethers.isAddress(reserveAddress)) {
    throw new Error("❌ Dirección inválida en .env");
  }

  // Conectar al contrato DOA Token (proxy)
  const doa = await ethers.getContractAt("DoaTokenV2", proxyAddress);

  // Cantidad a transferir: 300,000 DOA
  const amount = ethers.parseUnits("300000", 18);

  console.log(`⚙️ Transfiriendo ${ethers.formatUnits(amount, 18)} DOA a la Reserva (${reserveAddress})...`);
  const tx = await doa.transfer(reserveAddress, amount);
  console.log("📄 Hash de transferencia:", tx.hash);

  const receipt = await tx.wait();
  console.log(`✅ Transferencia completada hacia la Reserva ${reserveAddress} en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);
}

main().catch((e) => {
  console.error("❌ Error en transferReserve:", e.message);
  process.exitCode = 1;
});