// scripts/deploy-doa.js (Hardhat + ethers v6)
import { ethers, run } from "hardhat";

async function main() {
  // Obtén la fábrica del contrato
  const DoaToken = await ethers.getContractFactory("DoaToken");

  // Despliega con un supply inicial (ejemplo: 1,000,000 tokens)
  const doa = await DoaToken.deploy(1000000n); // usar BigInt en v6
  await doa.waitForDeployment();

  const doaAddress = await doa.getAddress();
  console.log(`✅ DoaToken desplegado en: ${doaAddress}`);
  console.log("TX hash:", doa.deploymentTransaction().hash);

  // Verificación automática en Polygonscan
  try {
    await run("verify:verify", {
      address: doaAddress,
      contract: "contracts/DoaToken.sol:DoaToken", // ruta + nombre exacto
      constructorArguments: [1000000n],
    });
    console.log("Contrato verificado en Polygonscan ✅");
  } catch (error) {
    console.error("❌ Error en la verificación:", error.message);
  }
}

// Ejecuta el script
main().catch((error) => {
  console.error("❌ Error en deploy-doa.js:", error);
  process.exitCode = 1;
});