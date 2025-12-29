const { ethers } = require("hardhat");

async function main() {
  const initialHolder = "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";
  const DoaFactory = await ethers.getContractFactory("DoaToken");
  const doa = await DoaFactory.deploy(initialHolder);
  await doa.waitForDeployment();

  console.log("DOA (nuevo) desplegado en:", await doa.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
