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

  const contract = new ethers.Contract(delegationContract, abi, signer);

  console.log(`Revocando delegación hacia ${delegatee}...`);

  const tx = await contract.revokeDelegation(delegatee);
  console.log(`Tx enviada: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Delegación revocada en bloque ${receipt.blockNumber}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
