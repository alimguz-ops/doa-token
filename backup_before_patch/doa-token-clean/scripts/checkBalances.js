import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  // Dirección correcta del contrato DOA en Amoy
  const doaTokenAddress = "0x4268ed4f726727974861ad319f29cc3354d6526b";
  const doaToken = await ethers.getContractAt("DoaToken", doaTokenAddress);

  // El signer debe ser la cuenta configurada en hardhat.config.js (0xf39F...92266)
  const [sender] = await ethers.getSigners();

  // Wallet MetaMask destino
  const recipient = "0x2CC2eB354fba2f84E26a9D1c7ecfa7c2AeB841f8";

  // Balances
  const senderBalance = await doaToken.balanceOf(sender.address);
  const recipientBalance = await doaToken.balanceOf(recipient);

  console.log(`Balance del sender (${sender.address}): ${ethers.formatUnits(senderBalance, 18)} DOA`);
  console.log(`Balance del recipient (${recipient}): ${ethers.formatUnits(recipientBalance, 18)} DOA`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
