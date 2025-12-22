import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  // Contrato DOA en Amoy
  const doaTokenAddress = "0x4268ed4f726727974861ad319f29cc3354d6526b";
  const doaToken = await ethers.getContractAt("DoaToken", doaTokenAddress);

  // Signer: debe ser la cuenta 0xf39F...92266 configurada en hardhat.config.js
  const [sender] = await ethers.getSigners();

  // Wallet MetaMask destino
  const recipient = "0x2CC2eB354fba2f84E26a9D1c7ecfa7c2AeB841f8";

  // Cantidad total de DOA a transferir
  const amount = ethers.parseUnits("1000000", 18);

  // Chequeo de balance antes
  const senderBalance = await doaToken.balanceOf(sender.address);
  console.log(`Balance inicial del sender: ${ethers.formatUnits(senderBalance, 18)} DOA`);

  if (senderBalance < amount) {
    console.error("❌ El signer no tiene suficientes DOA.");
    return;
  }

  // Transferencia
  const tx = await doaToken.transfer(recipient, amount);
  await tx.wait();

  console.log(`✅ Transferidos ${ethers.formatUnits(amount, 18)} DOA a ${recipient}`);

  // Chequeo de balances después
  const newSenderBalance = await doaToken.balanceOf(sender.address);
  const newRecipientBalance = await doaToken.balanceOf(recipient);

  console.log(`Nuevo balance del sender: ${ethers.formatUnits(newSenderBalance, 18)} DOA`);
  console.log(`Nuevo balance del recipient: ${ethers.formatUnits(newRecipientBalance, 18)} DOA`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
