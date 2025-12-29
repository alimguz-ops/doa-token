// scripts/verify.js
import hardhat from "hardhat";

const { run } = hardhat;

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractName = process.env.CONTRACT_NAME || "DoaToken";

  console.log("🔍 Verificando contrato en Polygonscan Amoy...");
  console.log("Dirección:", contractAddress);

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
    contract: `contracts/${contractName}.sol:${contractName}`,
  });

  console.log("✅ Verificación completada en Polygonscan Amoy");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
