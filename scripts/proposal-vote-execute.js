// scripts/proposal-vote-execute.js
const { ethers } = require("hardhat");

async function main() {
  const [owner, voter1, voter2] = await ethers.getSigners();

  const doaTokenAddress = "0x...";     // DoaTokenVotes
  const governorAddress = "0x...";     // DoaGovernor

  if (!ethers.isAddress(doaTokenAddress) || !ethers.isAddress(governorAddress)) {
    throw new Error("❌ Direcciones inválidas, ajusta en el script antes de continuar.");
  }

  const doaToken = await ethers.getContractAt("DoaTokenVotes", doaTokenAddress);
  const governor = await ethers.getContractAt("DoaGovernor", governorAddress);

  // 1. Delegar votos
  await doaToken.connect(owner).delegate(owner.address);
  await doaToken.connect(voter1).delegate(voter1.address);
  await doaToken.connect(voter2).delegate(voter2.address);
  console.log("✅ Delegación de votos completada");

  // 2. Crear propuesta
  const calldata = doaToken.interface.encodeFunctionData("setDecimals", [8]);
  const targets = [doaTokenAddress];
  const values = [0];
  const calldatas = [calldata];
  const description = "Propuesta: Cambiar decimales a 8";

  const tx = await governor.propose(targets, values, calldatas, description);
  const receipt = await tx.wait();
  const event = receipt.logs.find(l => l.address === governorAddress);
  const parsed = governor.interface.parseLog(event);
  const proposalId = parsed.args.proposalId;
  console.log(`📄 Propuesta creada con ID: ${proposalId.toString()} en bloque ${receipt.blockNumber}`);

  // 3. Votar
  try { await governor.connect(owner).castVote(proposalId, 1); } catch (e) { console.error("Error voto owner:", e); }
  try { await governor.connect(voter1).castVote(proposalId, 1); } catch (e) { console.error("Error voto voter1:", e); }
  try { await governor.connect(voter2).castVote(proposalId, 0); } catch (e) { console.error("Error voto voter2:", e); }
  console.log("✅ Votos emitidos");

  // 4. Avanzar tiempo
  await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  await ethers.provider.send("evm_mine");

  // 5. Cola en timelock
  const descHash = ethers.keccak256(ethers.toUtf8Bytes(description));
  await governor.queue(targets, values, calldatas, descHash);
  console.log("📥 Propuesta en cola para ejecución");

  // 6. Avanzar tiempo para timelock
  await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
  await ethers.provider.send("evm_mine");

  // 7. Ejecutar propuesta
  await governor.execute(targets, values, calldatas, descHash);
  console.log("✅ Propuesta ejecutada: decimales cambiados a 8");
}

main().catch((error) => {
  console.error("❌ Error en script:", error);
  process.exitCode = 1;
});