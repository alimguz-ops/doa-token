// scripts/verify-proxy.js
import { run, ethers } from "hardhat";

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress) {
    throw new Error("❌ Debes definir CONTRACT_ADDRESS en tu .env con la dirección del proxy");
  }
  if (!ethers.utils.isAddress(proxyAddress) || proxyAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error(`❌ Dirección inválida: ${proxyAddress}`);
  }

  console.log(`⚙️ Verificando proxy en el explorador: ${proxyAddress}`);

  let args = [];
  try {
    args = process.env.CONSTRUCTOR_ARGS ? JSON.parse(process.env.CONSTRUCTOR_ARGS) : [];
  } catch (err) {
    console.warn("⚠️ Error parseando CONSTRUCTOR_ARGS, usando []");
    args = [];
  }

  await run("verify:verify", {
    address: proxyAddress,
    constructorArguments: args,
  });

  console.log("✅ Verificación completada:", proxyAddress);
}

main().catch((e) => {
  console.error("❌ Error en verify-proxy:", e);
  process.exitCode = 1;
});
