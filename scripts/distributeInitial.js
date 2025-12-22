import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const doaTokenAddress = "0x89bdBe3DB41129a5946DFA1459653051E95398ba"; // contrato recién desplegado
  const doaToken = await ethers.getContractAt("DoaToken", doaTokenAddress);

  const [sender] = await ethers.getSigners();

  const allocations = [
    { name: "Colaborador", address: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1", amount: "100000" },
    { name: "Reserva", address: "0xea554fCc14360F1912D2FdD1AeCe01642cae3761", amount: "200000" },
    { name: "Constructor", address: "0xD1f7a79CE44b267Dfe51B6F84008208550a30562", amount: "200000" },
    { name: "Admin", address: "0x18e596F48D25F0fdb1A57332112222cDB5E97A78", amount: "200000" } // 👈 pendiente Safe Wallet
  ];

  const senderBalance = await doaToken.balanceOf(sender.address);
  console.log(`Balance inicial del owner (${sender.address}): ${ethers.formatUnits(senderBalance, 18)} DOA`);

  for (const alloc of allocations) {
    const amount = ethers.parseUnits(alloc.amount, 18);
    console.log(`➡️ Transfiriendo ${alloc.amount} DOA a ${alloc.name} (${alloc.address})...`);
    const tx = await doaToken.transfer(alloc.address, amount);
    await tx.wait();
    console.log(`✅ Transferencia completada para ${alloc.name}`);
  }

  const newSenderBalance = await doaToken.balanceOf(sender.address);
  console.log(`Balance final del owner: ${ethers.formatUnits(newSenderBalance, 18)} DOA`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
