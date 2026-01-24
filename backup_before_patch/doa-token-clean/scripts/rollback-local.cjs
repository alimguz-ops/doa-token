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

  const contract = await Contract.deploy(name, symbol, supply, owner);
  await contract.deployed();

  console.log("âœ… Contrato redeployado en:", contract.address);
}

main().catch((error) => {
  console.error("âŒ Error en rollback local:", error);
  process.exitCode = 1;
});

