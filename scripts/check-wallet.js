// scripts/check-wallet.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  const address = signer.address;

  console.log(`\n== Verificación de la dirección ${address} ==`);

  // 1. Mostrar saldo
  const balance = await ethers.provider.getBalance(address);
  console.log(`Saldo actual: ${ethers.formatEther(balance)} POL`);

  // 2. Revisar delegaciones EIP-7702 (si el contrato las expone)
  const delegationContract = "0x0000000000000000000000000000000000007702";
  const abiDelegation = [
    "function revokeDelegation(address delegatee) public"
    // Nota: no existe función pública estándar para listar delegaciones
  ];
  const contractDelegation = new ethers.Contract(delegationContract, abiDelegation, signer);
  console.log("Delegaciones: revisa en Polygonscan pestaña Autorizaciones (EIP-7702)");

  // 3. Revisar aprobaciones de tokens ERC-20
  // Ejemplo con USDC (puedes añadir otros tokens relevantes)
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const abiERC20 = [
    "function allowance(address owner, address spender) view returns (uint256)"
  ];
  const usdc = new ethers.Contract(usdcAddress, abiERC20, signer);

  // Revisar aprobación hacia un contrato sospechoso (ejemplo: 0x52C99acc...)
  const suspicious = "0x52C99accBaF0659Df23DDbfBE9dFa64FB2732e6B";
  const allowance = await usdc.allowance(address, suspicious);
  console.log(`Aprobación USDC hacia ${suspicious}: ${allowance.toString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
