// scripts/revoke-delegation.js
import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();

  // Contrato de sistema EIP-7702 en Polygon
  const delegationContract = "0x0000000000000000000000000000000000007702";

  // ABI mínima: solo revocar
  const abi = [
    "function revokeDelegation(address delegatee) public"
  ];

  // Dirección delegada que viste en Polygonscan
  const delegatee = "0x45F625Af563BfCAC68b458de00Bf30F0BFd8Ce3f";

  if (!ethers.isAddress(delegationContract) || !ethers.isAddress(delegatee)) {
    throw new Error("❌ Dirección inválida");
  }

  const contract = new ethers.Contract(delegationContract, abi, signer);

  console.log(`Revocando delegación hacia ${delegatee} con cuenta ${signer.address}...`);

  const tx = await contract.revokeDelegation(delegatee);
  console.log(`📄 Tx enviada: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`✅ Delegación revocada en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);
}

main().catch((err) => {
  console.error("❌ Error al revocar delegación:", err.message);
  process.exit(1);
});