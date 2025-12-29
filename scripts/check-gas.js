// scripts/check-gas.js
import dotenv from "dotenv";
import hardhat from "hardhat";

dotenv.config();

const { ethers } = hardhat;

async function main() {
  // Obtener el emisor y su saldo
  const [signer] = await ethers.getSigners();
  const balanceWei = await ethers.provider.getBalance(signer.address);
  const balanceMatic = Number(ethers.formatEther(balanceWei)); // en POL/MATIC

  // Estimación de costo promedio por transferencia ERC20
  // Ajusta si ves variaciones (ej., 0.008–0.015 MATIC)
  const gasCostMatic = 0.0108;

  // Cálculo de capacidad de transferencias
  const maxTransfers = Math.floor(balanceMatic / gasCostMatic);

  console.log("\n== Verificación de saldo y capacidad ==");
  console.log(`Dirección emisora: ${signer.address}`);
  console.log(`Saldo actual: ${balanceMatic.toFixed(6)} POL/MATIC`);
  console.log(`Costo estimado por transferencia: ${gasCostMatic} MATIC`);
  console.log(`Máximo de transferencias posibles: ${maxTransfers}`);

  // Opcional: muestra gas price actual y coste real estimado
  const gasPriceWei = await ethers.provider.getFeeData().then(d => d.gasPrice ?? 0n);
  if (gasPriceWei) {
    const gasPriceGwei = Number(gasPriceWei) / 1e9;
    // Transferencia ERC20 típica ~50,000–70,000 gas. Usamos 60,000.
    const estimatedGasUnits = 60000;
    const estimatedTxCostMatic = (gasPriceGwei * estimatedGasUnits) / 1e9;
    console.log(`Gas price actual: ${gasPriceGwei.toFixed(2)} gwei`);
    console.log(`Costo estimado real por transferencia: ${estimatedTxCostMatic.toFixed(6)} MATIC`);
    const maxTransfersReal = Math.floor(balanceMatic / estimatedTxCostMatic);
    console.log(`Máximo de transferencias (estimación real): ${maxTransfersReal}`);
  }
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
