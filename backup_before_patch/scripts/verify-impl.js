import hardhat from "hardhat";
import { ethers } from "ethers";
const { run } = hardhat;

async function main() {
  const implAddress = process.env.IMPL_ADDRESS;
  if (!implAddress) {
    throw new Error("❌ Debes definir IMPL_ADDRESS en tu .env con la dirección de la implementación");
  }
  if (!ethers.isAddress(implAddress)) {
    throw new Error(`❌ Dirección inválida: ${implAddress}`);
  }

  console.log(`⚙️ Verificando implementación en Polygonscan: ${implAddress}`);

  const args = process.env.CONSTRUCTOR_ARGS ? JSON.parse(process.env.CONSTRUCTOR_ARGS) : [];

  await run("verify:verify", {
    address: implAddress,
    constructorArguments: args,
  });

  console.log("✅ Verificación completada en Polygonscan:", implAddress);
}

main().catch((e) => {
  console.error("❌ Error en verify-impl:", e.message);
  process.exitCode = 1;
});