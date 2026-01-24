// scripts/deploy_doa.js (Hardhat + ethers v6)
import { ethers } from "hardhat";

async function main() {
  const initialHolder = "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5";

  const DoaFactory = await ethers.getContractFactory("DoaToken");
  const doa = await DoaFactory.deploy(initialHolder);

  // Esperar confirmación de despliegue
  await doa.waitForDeployment();

  const doaAddress = await doa.getAddress();
  console.log("✅ DOA (nuevo) desplegado en:", doaAddress);
  console.log("TX hash:", doa.deploymentTransaction().hash);
}

main().catch((error) => {
  console.error("❌ Error en deploy_doa.js:", error);
  process.exitCode = 1;
});