// scripts/check-wallet.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  if (!signer) {
    throw new Error("❌ No se encontró ningún signer configurado en Hardhat.");
  }
  const address = signer.address;

  console.log(`\n== Verificación de la dirección ${address} ==`);

  // 1. Mostrar saldo
  const balance = await ethers.provider.getBalance(address);
  const balanceMatic = parseFloat(ethers.formatEther(balance));
  console.log(`Saldo actual: ${balanceMatic.toFixed(6)} POL/MATIC`);

  // 2. Revisar delegaciones EIP-7702 (placeholder)
  const delegationContract = "0x0000000000000000000000000000000000007702";
  const abiDelegation = [
    "function revokeDelegation(address delegatee) public"
  ];
  const contractDelegation = new ethers.Contract(delegationContract, abiDelegation, signer);
  console.log("ℹ️ Delegaciones: revisa en Polygonscan pestaña Autorizaciones (EIP-7702)");

  // 3. Revisar aprobaciones de tokens ERC-20
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const abiERC20 = [
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  const usdc = new ethers.Contract(usdcAddress, abiERC20, signer);

  const suspicious = process.env.SUSPICIOUS_CONTRACT || "0x52C99accBaF0659Df23DDbfBE9dFa64FB2732e6B";
  const allowance = await usdc.allowance(address, suspicious);
  console.log(`Aprobación USDC hacia ${suspicious}: ${allowance.toString()}`);
}

main().catch((err) => {
  console.error("❌ Error en check-wallet:", err.message);
  process.exit(1);
});