// scripts/list-delegations.js
import hardhat from "hardhat";
const { ethers, network } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  const delegator = signer.address;

  const delegationContract = "0x0000000000000000000000000000000000007702";
  if (!ethers.isAddress(delegationContract)) {
    throw new Error(`❌ Dirección de contrato inválida: ${delegationContract}`);
  }

  const abi = [
    "function getDelegations(address delegator) public view returns (address[])",
    "function revokeDelegation(address delegatee) public"
  ];

  const contract = new ethers.Contract(delegationContract, abi, signer);

  console.log(`\n== Delegaciones activas de ${delegator} ==`);

  let delegates;
  try {
    delegates = await contract.getDelegations(delegator);
  } catch (err) {
    console.error("❌ Error al consultar delegaciones:", err);
    return;
  }

  if (!delegates || delegates.length === 0) {
    console.log("No hay delegaciones activas.");
    return;
  }

  delegates.forEach((d, i) => {
    console.log(`${i + 1}. Delegado a: ${d}`);
  });

  // Ejemplo: revocar la primera delegación
  const delegatee = delegates[0];
  console.log(`\nRevocando delegación hacia ${delegatee}...`);

  try {
    const tx = await contract.revokeDelegation(delegatee);
    console.log(`Tx enviada: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Delegación revocada en bloque ${receipt.blockNumber} en red ${network.name}`);
  } catch (err) {
    console.error("❌ Error al revocar delegación:", err);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});