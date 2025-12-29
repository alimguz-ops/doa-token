// scripts/list-delegations.js
import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  const delegator = signer.address;

  // Contrato de sistema EIP-7702 en Polygon
  const delegationContract = "0x0000000000000000000000000000000000007702";

  // ABI mínima para consultar y revocar delegaciones
  const abi = [
    "function getDelegations(address delegator) public view returns (address[])",
    "function revokeDelegation(address delegatee) public"
  ];

  const contract = new ethers.Contract(delegationContract, abi, signer);

  console.log(`\n== Delegaciones activas de ${delegator} ==`);

  // Listar todas las delegaciones activas
  const delegates = await contract.getDelegations(delegator);
  if (delegates.length === 0) {
    console.log("No hay delegaciones activas.");
    return;
  }

  delegates.forEach((d, i) => {
    console.log(`${i + 1}. Delegado a: ${d}`);
  });

  // Ejemplo: revocar la primera delegación
  const delegatee = delegates[0];
  console.log(`\nRevocando delegación hacia ${delegatee}...`);

  const tx = await contract.revokeDelegation(delegatee);
  console.log(`Tx enviada: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Delegación revocada en bloque ${receipt.blockNumber}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
