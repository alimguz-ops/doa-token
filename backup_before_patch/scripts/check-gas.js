// scripts/check-gas.js
import dotenv from "dotenv";
import hardhat from "hardhat";

dotenv.config();

const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  if (!signer) {
    throw new Error("❌ No se encontró ningún signer configurado en Hardhat.");
  }

  const balanceWei = await ethers.provider.getBalance(signer.address);
  const balanceMatic = parseFloat(ethers.formatEther(balanceWei));

  // Estimación de costo promedio por transferencia ERC20
  const gasCostMatic = parseFloat(process.env.GAS_COST_MATIC || "0.0108");

  const maxTransfers = Math.floor(balanceMatic / gasCostMatic);

  console.log("\n== Verificación de saldo y capacidad ==");
  console.log(`Dirección emisora: ${signer.address}`);
  console.log(`Saldo actual: ${balanceMatic.toFixed(6)} POL/MATIC`);
  console.log(`Costo estimado por transferencia: ${gasCostMatic} MATIC`);
  console.log(`Máximo de transferencias posibles (estimación fija): ${maxTransfers}`);

  // Gas price actual y coste real estimado
  const feeData = await ethers.provider.getFeeData();
  const gasPriceWei = feeData.gasPrice ?? 0n;
  if (gasPriceWei > 0n) {
    const gasPriceGwei = Number(gasPriceWei) / 1e9;
    const estimatedGasUnits = parseInt(process.env.ESTIMATED_GAS_UNITS || "60000", 10);
    const estimatedTxCostMatic = (gasPriceGwei * estimatedGasUnits) / 1e9;

    console.log(`Gas price actual: ${gasPriceGwei.toFixed(2)} gwei`);
    console.log(`Costo estimado real por transferencia: ${estimatedTxCostMatic.toFixed(6)} MATIC`);

    const maxTransfersReal = Math.floor(balanceMatic / estimatedTxCostMatic);
    console.log(`Máximo de transferencias (estimación real): ${maxTransfersReal}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("❌ Error en check-gas:", err.message);
  process.exit(1);
});