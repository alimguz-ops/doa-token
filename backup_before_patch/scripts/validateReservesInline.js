const { ethers } = require("ethers");

// RPC de Polygon Amoy
const RPC_URL = "https://rpc-amoy.polygon.technology";

// Ajusta estas direcciones según tu despliegue
const PAIR_ADDRESS = "0x...";       // Dirección del par Token/MATIC
const TOKEN_ADDRESS = "0x...";      // Dirección de tu token
const WETH_ADDRESS = "0x...";       // Dirección de WMATIC en Amoy

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  console.log("\n🔎 Validando reservas del par en QuickSwap Amoy...\n");

  if (!ethers.isAddress(PAIR_ADDRESS) || !ethers.isAddress(TOKEN_ADDRESS) || !ethers.isAddress(WETH_ADDRESS)) {
    throw new Error("❌ Alguna dirección no es válida");
  }

  const abiPair = [
    "function getReserves() view returns (uint112,uint112,uint32)",
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ];

  const pair = new ethers.Contract(PAIR_ADDRESS, abiPair, provider);

  try {
    const [reserve0, reserve1, blockTimestampLast] = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    // Identificar cuál es tu token y cuál es WMATIC
    let tokenReserve, maticReserve;
    if (token0.toLowerCase() === TOKEN_ADDRESS.toLowerCase()) {
      tokenReserve = reserve0;
      maticReserve = reserve1;
    } else {
      tokenReserve = reserve1;
      maticReserve = reserve0;
    }

    // Obtener decimales reales del token
    const erc20Abi = ["function decimals() view returns (uint8)"];
    const token = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);
    const tokenDecimals = await token.decimals();

    console.log("✅ Reservas actuales:");
    console.log("   Token:", ethers.formatUnits(tokenReserve, tokenDecimals));
    console.log("   WMATIC:", ethers.formatUnits(maticReserve, 18));
    console.log(`🔗 Par tokens: ${token0} / ${token1}`);
    console.log(`🕒 Última actualización de reservas en bloque: ${blockTimestampLast}`);

    if (tokenReserve > 0n && maticReserve > 0n) {
      console.log("\n📊 Liquidez disponible: ✅ El par está operativo.\n");
    } else {
      console.log("\n⚠️ Liquidez insuficiente: ❌ No se puede operar correctamente.\n");
    }
  } catch (err) {
    console.error("❌ Error al validar reservas:", err.message);
  }
}

main();