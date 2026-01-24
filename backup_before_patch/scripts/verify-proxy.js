import hardhat from "hardhat";
import { ethers } from "ethers";
const { run } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress) {
    throw new Error("❌ Debes definir CONTRACT_ADDRESS en tu .env con la dirección del proxy");
  }
  if (!ethers.isAddress(proxyAddress)) {
    throw new Error(`❌ Dirección inválida: ${proxyAddress}`);
  }

  console.log(`⚙️ Verificando proxy en Polygonscan: ${proxyAddress}`);

  const args = process.env.CONSTRUCTOR_ARGS ? JSON.parse(process.env.CONSTRUCTOR_ARGS) : [];

  await run("verify:verify", {
    address: proxyAddress,
    constructorArguments: args,
  });

  console.log("✅ Verificación completada en Polygonscan:", proxyAddress);
}

main().catch((e) => {
  console.error("❌ Error en verify-proxy:", e.message);
  process.exitCode = 1;
});