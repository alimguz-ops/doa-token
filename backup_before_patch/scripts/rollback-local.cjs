require("dotenv").config();
const hre = require("hardhat");

async function main() {
  if (process.env.LOCAL_RESET === "true") {
    console.log("â™»ï¸ Reiniciando red local con hardhat_reset...");
    await hre.network.provider.send("hardhat_reset");
    console.log("âœ… Red local reiniciada.");
  }

  const Contract = await hre.ethers.getContractFactory("DoaToken");

  const name = process.env.NAME;
  const symbol = process.env.SYMBOL;
  const supply = process.env.INITIALSUPPLY;
  const owner = process.env.OWNER;

  if (!name || !symbol || !supply || !owner) {
    throw new Error("âŒ Faltan variables de entorno NAME, SYMBOL, INITIALSUPPLY u OWNER");
  }

  const supplyParsed = hre.ethers.parseUnits(supply, 18);

  const contract = await Contract.deploy(name, symbol, supplyParsed, owner);
  await contract.waitForDeployment();

  const receipt = await contract.deploymentTransaction().wait();
  console.log(`âœ… Contrato redeployado en ${await contract.getAddress()} (bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed})`);
}

main().catch((error) => {
  console.error("âŒ Error en rollback local:", error);
  process.exitCode = 1;
});
