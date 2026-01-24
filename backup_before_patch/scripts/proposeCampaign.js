// scripts/proposeCampaign.js
const { ethers } = require("hardhat");

async function main() {
  const [proposer] = await ethers.getSigners();

  const governorAddr = process.env.GOVERNOR_ADDR;
  const automationAddr = process.env.AUTOMATION_ADDR;

  if (!ethers.isAddress(governorAddr) || !ethers.isAddress(automationAddr)) {
    throw new Error("❌ Direcciones inválidas, ajusta en el script antes de continuar.");
  }

  const governor = await ethers.getContractAt("DoaGovernor", governorAddr);
  const automation = await ethers.getContractAt("AutomationCampaign", automationAddr);

  // Datos de campaña
  const campaignId = 1;
  const label = "Calendario30";
  const metadataURI = "file://D:/doa-token/marketing/calendar/day-1-to-30.json";

  const targets = [automationAddr];
  const values = [0];
  const calldatas = [
    automation.interface.encodeFunctionData("executeCampaign", [campaignId, label, metadataURI]),
  ];
  const description = "Propuesta: Ejecutar campaña de marketing de 30 días";

  console.log("Creando propuesta...");
  const tx = await governor.connect(proposer).propose(targets, values, calldatas, description);
  const receipt = await tx.wait();
  const event = receipt.logs.find(l => l.address === governorAddr);
  const parsed = governor.interface.parseLog(event);
  const proposalId = parsed.args.proposalId;
  console.log(`📄 Propuesta creada con ID: ${proposalId.toString()} en bloque ${receipt.blockNumber}`);

  // Votar
  console.log("Votando a favor...");
  try {
    await (await governor.castVote(proposalId, 1)).wait();
    console.log("✅ Voto emitido");
  } catch (e) {
    console.error("❌ Error al votar:", e);
  }

  // Avanzar tiempo de votación (solo en red local)
  await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  await ethers.provider.send("evm_mine");

  // Queue en timelock
  console.log("Cola en timelock...");
  const descHash = ethers.keccak256(ethers.toUtf8Bytes(description));
  await (await governor.queue(targets, values, calldatas, descHash)).wait();

  // Avanzar delay del timelock (solo en red local)
  await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
  await ethers.provider.send("evm_mine");

  // Ejecutar
  console.log("Ejecutando propuesta...");
  await (await governor.execute(targets, values, calldatas, descHash)).wait();

  console.log("✅ Campaña ejecutada on-chain. Escucha el evento CampaignExecuted para disparar marketing.");
}

main().catch((e) => {
  console.error("❌ Error en script:", e);
  process.exit(1);
});