// scripts/verifyPools.js
require("dotenv").config();
const fs = require("fs");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC);

const factoryAddr = "0x5757371414417b8c6caad45baef941abc7d3ab32"; // QuickSwap V2 Factory
const factoryAbi = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];
const pairAbi = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

const tokenDecimals = {
  "0x692d951163df3f7d9fe071413f92c319d9b7369e": 18, // DOA
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": 18, // WPOL
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": 6,  // USDC
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": 6,  // USDT
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": 18  // DAI
};

async function verifyPair(tokenA, tokenB) {
  try {
    if (!ethers.utils.isAddress(tokenA) || !ethers.utils.isAddress(tokenB)) {
      console.error(`❌ Dirección inválida en par: ${tokenA}/${tokenB}`);
      return;
    }

    const factory = new ethers.Contract(factoryAddr, factoryAbi, provider);
    const pairAddr = await factory.getPair(tokenA, tokenB);

    if (pairAddr === ethers.constants.AddressZero) {
      console.log(`❌ No existe par ${tokenA}/${tokenB}`);
      return;
    }

    const pair = new ethers.Contract(pairAddr, pairAbi, provider);
    const [reserve0, reserve1, blockTimestampLast] = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    const decimals0 = tokenDecimals[token0.toLowerCase()] || 18;
    const decimals1 = tokenDecimals[token1.toLowerCase()] || 18;

    const r0 = ethers.utils.formatUnits(reserve0, decimals0);
    const r1 = ethers.utils.formatUnits(reserve1, decimals1);

    console.log(`✅ Par ${token0}/${token1} (${pairAddr})`);
    console.log(`   Reservas: ${Number(r0).toFixed(4)} / ${Number(r1).toFixed(4)}`);
    console.log(`   🕒 Última actualización: ${blockTimestampLast}`);

    // Calcular precio DOA si está en el par
    if (token0.toLowerCase() === "0x692d951163df3f7d9fe071413f92c319d9b7369e") {
      const price = parseFloat(r1) / parseFloat(r0);
      console.log(`   💰 Precio DOA → ${price.toFixed(6)} ${token1}`);
    } else if (token1.toLowerCase() === "0x692d951163df3f7d9fe071413f92c319d9b7369e") {
      const price = parseFloat(r0) / parseFloat(r1);
      console.log(`   💰 Precio DOA → ${price.toFixed(6)} ${token0}`);
    }
  } catch (err) {
    console.error(`❌ Error verificando par ${tokenA}/${tokenB}:`, err.message);
  }
}

async function main() {
  const pairs = JSON.parse(fs.readFileSync("pairs.json"));
  for (const pair of pairs) {
    await verifyPair(pair.tokenA, pair.tokenB);
  }
}

main().catch((err) => {
  console.error("❌ Error general:", err.message);
});