// scripts/checkPoolsAll.js
// Consulta reservas de todos los pares DOA en QuickSwap y calcula precios

require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Provider Polygon
const polygonProvider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// Direcciones de tokens
const doaAddress   = "0x692d951163df3f7D9Fe071413F92c319D9B7369E"; // DOA proxy
const usdcAddress  = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC oficial
const usdtAddress  = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT oficial
const wpolAddress  = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"; // WPOL
const wethAddress  = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH

// QuickSwap V2 Factory
const factory = "0x5757371414417b8c6caad45baef941abc7d3ab32";
const factoryAbi = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];
const pairAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

async function checkPair(tokenA, tokenB, label) {
  const factoryContract = new ethers.Contract(factory, factoryAbi, polygonProvider);
  const pairAddress = await factoryContract.getPair(tokenA, tokenB);

  if (pairAddress === ethers.constants.AddressZero) {
    console.log(`❌ No existe el par ${label} en QuickSwap`);
    return;
  }

  const pairContract = new ethers.Contract(pairAddress, pairAbi, polygonProvider);
  const token0 = await pairContract.token0();
  const token1 = await pairContract.token1();
  const { reserve0, reserve1 } = await pairContract.getReserves();

  let reserveDOA, reserveOther;
  if (token0.toLowerCase() === doaAddress.toLowerCase()) {
    reserveDOA = reserve0;
    reserveOther = reserve1;
  } else {
    reserveDOA = reserve1;
    reserveOther = reserve0;
  }

  const priceDOAinOther = Number(reserveOther) / Number(reserveDOA);

  console.log(`📊 Reservas del par ${label}:`);
  console.log(`   DOA:   ${reserveDOA.toString()}`);
  console.log(`   ${label.split("/")[1]}: ${reserveOther.toString()}`);
  console.log(`💰 Precio DOA en ${label.split("/")[1]}: ${priceDOAinOther}\n`);
}

async function main() {
  console.log("🔎 Consultando pares DOA en QuickSwap...\n");

  await checkPair(doaAddress, usdcAddress, "DOA/USDC");
  await checkPair(doaAddress, usdtAddress, "DOA/USDT");
  await checkPair(doaAddress, wpolAddress, "DOA/WPOL");
  await checkPair(doaAddress, wethAddress, "DOA/WETH");
}

main().catch((err) => {
  console.error("❌ Error al consultar pools:", err);
});
