// scripts/verify.js
require("dotenv").config();
const hre = require("hardhat");

async function main() {
  // Dirección del contrato proxy que quieres verificar
  const contractAddress =
    process.env.CONTRACT_ADDRESS ||
    "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

  console.log("🔎 Verificando contrato DOA en Polygonscan...");
  console.log("Dirección:", contractAddress);

  // Usa el nombre totalmente calificado si tienes duplicados
  // Ejemplo: "contracts/DoaToken.sol:DoaToken"
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
    contract: "contracts/DoaToken.sol:DoaToken",
  });

  console.log("✅ Verificación completada en Polygonscan");
}

main().catch((error) => {
  console.error("❌ Error en verify.js:", error);
  process.exitCode = 1;
});
