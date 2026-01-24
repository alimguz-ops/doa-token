import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");

async function checkAddress(address) {
  try {
    if (!ethers.isAddress(address)) {
      console.error("❌ Dirección inválida:", address);
      return;
    }
    const code = await provider.getCode(address);
    if (code === "0x") {
      console.log("❌ No hay contrato en:", address);
    } else {
      console.log("✅ Contrato desplegado en:", address);
      console.log(`📦 Bytecode length: ${code.length}`);
    }
  } catch (err) {
    console.error("⚠️ Error al consultar dirección:", err.message);
  }
}

checkAddress("0x126DE20f68F025948feefD0BbB451eCf370Eb5f1");