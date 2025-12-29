import hardhat from "hardhat";
const { run } = hardhat;

async function main() {
  const proxyAddress = process.env.CONTRACT_ADDRESS;
  if (!proxyAddress) {
    throw new Error("❌ Debes definir CONTRACT_ADDRESS en tu .env con la dirección del proxy");
  }

  console.log("⚙️ Verificando proxy en Polygonscan:", proxyAddress);

  await run("verify:verify", {
    address: proxyAddress,
    constructorArguments: [],
  });

  console.log("✅ Verificación completada en Polygonscan:", proxyAddress);
}

main().catch((e) => {
  console.error("❌ Error en verify-proxy:", e);
  process.exitCode = 1;
});
