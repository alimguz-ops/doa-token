import { ethers, run } from "hardhat";

async function main() {
  // Obtén la fábrica del contrato
  const DoaToken = await ethers.getContractFactory("DoaToken");

  // Despliega con un supply inicial (ejemplo: 1,000,000 tokens)
  const doa = await DoaToken.deploy(1000000);
  await doa.deployed();

  console.log(`DoaToken desplegado en: ${doa.address}`);

  // Verificación automática en Polygonscan
  try {
    await run("verify:verify", {
      address: doa.address,
      constructorArguments: [1000000],
    });
    console.log("Contrato verificado en Polygonscan ✅");
  } catch (error) {
    console.error("Error en la verificación:", error.message);
  }
}

// Ejecuta el script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
