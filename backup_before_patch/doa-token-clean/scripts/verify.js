// scripts/verify.js
import hardhat from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const { run } = hardhat;

async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("❌ CONTRACT_ADDRESS no está definido en .env");
  }

  console.log("Verificando contrato en Polygonscan:", address);

  await run("verify:verify", {
    address,
    constructorArguments: [], // upgradeable: sin constructor
  });

  console.log("✅ Verificación completada en Polygonscan");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
