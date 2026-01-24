import hardhat from "hardhat";
import { execSync } from "node:child_process";
import os from "os";

const { ethers, run } = hardhat;

async function main() {
  try {
    console.log("🧹 Limpiando proyecto...");
    if (os.platform() === "win32") {
      execSync("rmdir /s /q node_modules && del package-lock.json", { stdio: "inherit" });
    } else {
      execSync("rm -rf node_modules package-lock.json", { stdio: "inherit" });
    }
    execSync("npm install --legacy-peer-deps", { stdio: "inherit" });

    console.log("⚙️ Compilando contratos...");
    execSync("npx hardhat compile", { stdio: "inherit" });

    console.log("🚀 Desplegando contrato...");
    const DoaToken = await ethers.getContractFactory("DoaToken");
    const doa = await DoaToken.deploy(1000000);
    await doa.waitForDeployment();
    const address = await doa.getAddress();
    console.log(`Contrato desplegado en: ${address}`);

    const receipt = await doa.deploymentTransaction().wait();
    console.log(`✅ Deploy en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);

    console.log("🔍 Verificando contrato en Polygonscan...");
    try {
      await run("verify:verify", {
        address,
        constructorArguments: [1000000],
      });
      console.log("Contrato verificado en Polygonscan ✅");
    } catch (err) {
      console.error("⚠️ Error en verificación:", err.message);
    }
  } catch (error) {
    console.error("❌ Error en el proceso:", error.message);
    process.exitCode = 1;
  }
}

main();