import hardhat from "hardhat";
import { execSync } from "node:child_process";

const { ethers, run } = hardhat;

async function main() {
  try {
    console.log("🧹 Limpiando proyecto...");
    execSync("rmdir /s /q node_modules && del package-lock.json", { stdio: "inherit" });
    execSync("npm install --legacy-peer-deps", { stdio: "inherit" });

    console.log("⚙️ Compilando contratos...");
    execSync("npx hardhat compile", { stdio: "inherit" });

    console.log("🚀 Desplegando contrato...");
    const DoaToken = await ethers.getContractFactory("DoaToken");
    const doa = await DoaToken.deploy(1000000);
    await doa.deployed();
    console.log(`Contrato desplegado en: ${doa.address}`);

    console.log("🔍 Verificando contrato en Polygonscan...");
    await run("verify:verify", {
      address: doa.address,
      constructorArguments: [1000000],
    });
    console.log("Contrato verificado en Polygonscan ✅");
  } catch (error) {
    console.error("❌ Error en el proceso:", error.message);
    process.exitCode = 1;
  }
}

main();
