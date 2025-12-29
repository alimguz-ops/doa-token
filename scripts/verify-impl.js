import hardhat from "hardhat";
const { run } = hardhat;

async function main() {
  const implAddress = process.env.IMPL_ADDRESS;
  if (!implAddress) {
    throw new Error("❌ Debes definir IMPL_ADDRESS en tu .env con la dirección de la implementación");
  }

  console.log("⚙️ Verificando implementación en Polygonscan:", implAddress);

  await run("verify:verify", {
    address: implAddress,
    constructorArguments: [],
  });

  console.log("✅ Verificación completada en Polygonscan:", implAddress);
}

main().catch((e) => {
  console.error("❌ Error en verify-impl:", e);
  process.exitCode = 1;
});
