import { getSigner, createPair, addLiquidity, removeLiquidity, getPoolBalances } from "../lib/liquidity.mjs";

async function main() {
  const signer = getSigner();
  console.log("🚀 Cuenta activa:", await signer.getAddress());

  // Crear par y añadir liquidez inicial
  await createPair(signer);
  await addLiquidity(signer, "1000000", "50");

  // Consultar balances
  await getPoolBalances(signer);

  // Ejemplo: remover liquidez
  // await removeLiquidity(signer, "10"); // Remueve 10 LP tokens
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
