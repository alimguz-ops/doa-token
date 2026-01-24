import { ethers } from "ethers";
import { getSigner, createPair, addLiquidity, removeLiquidity, getPoolBalances } from "../lib/liquidity.mjs";

async function main() {
  const signer = getSigner();
  if (!signer) throw new Error("❌ No se pudo obtener signer");

  console.log("🚀 Cuenta activa:", await signer.getAddress());

  try {
    console.log("🔄 Creando par...");
    await createPair(signer);

    console.log("🔄 Añadiendo liquidez inicial...");
    const txAdd = await addLiquidity(signer, ethers.parseUnits("1000000", 18), ethers.parseUnits("50", 18));
    const receiptAdd = await txAdd.wait();
    console.log(`✅ Liquidez añadida en bloque ${receiptAdd.blockNumber}, tx ${receiptAdd.hash}`);

    console.log("🔍 Consultando balances...");
    await getPoolBalances(signer);

    // Ejemplo: remover liquidez
    // const txRemove = await removeLiquidity(signer, ethers.parseUnits("10", 18));
    // const receiptRemove = await txRemove.wait();
    // console.log(`✅ Liquidez retirada en bloque ${receiptRemove.blockNumber}, tx ${receiptRemove.hash}`);
  } catch (error) {
    console.error("❌ Error durante la gestión de liquidez:", error.message);
  }
}

main().catch((error) => {
  console.error("❌ Error general:", error.message);
  process.exitCode = 1;
});