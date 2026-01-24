// scripts/checkPair.js
// Consulta pares DOA en QuickSwap (Polygon mainnet) con WPOL incluido

require("dotenv").config();
const {
  JsonRpcProvider,
  Contract,
  AddressZero,
  getAddress,
  formatUnits,
} = require("ethers");

// ✅ Provider Polygon mainnet
const provider = new JsonRpcProvider(
  process.env.POLYGON_RPC_URL || "https://polygon-rpc.com"
);

// Direcciones de tokens (normalizadas con checksum)
const doaAddress = getAddress("0x692d951163df3f7D9Fe071413F92c319D9B7369E"); // DOA proxy

const baseTokens = {
  USDC: getAddress("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"),
  USDT: getAddress("0xc2132D05D31c914a87C6611C10748AEb04B58e8F"),
  WMATIC: getAddress("0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"), // Wrapped MATIC oficial
  WPOL: getAddress("0x79Ea824CCC9D3CB6fdc735305e44f7Bb0Ef69799"),   // WPOL (según tu dato)
  POL: getAddress("0x5509FdcB0B430534F3aF090aEC504b5cccB3a9e0"),
  WETH: getAddress("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"),
};

// QuickSwap V2 Factory (mainnet)
const factory = getAddress("0x5757371414417b8c6caad45baef941abc7d3ab32");
const factoryAbi = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];
const pairAbi = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];
const erc20Abi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

async function checkPair(tokenA, tokenB, label) {
  try {
    const factoryContract = new Contract(factory, factoryAbi, provider);
    const pairAddress = await factoryContract.getPair(tokenA, tokenB);

    if (pairAddress === AddressZero) {
      console.log(`❌ No existe el par ${label} en QuickSwap`);
      return;
    }

    console.log(`✅ Par ${label} encontrado: ${pairAddress}`);

    const pairContract = new Contract(pairAddress, pairAbi, provider);
    const [token0, token1] = await Promise.all([
      pairContract.token0(),
      pairContract.token1(),
    ]);

    const { reserve0, reserve1 } = await pairContract.getReserves();

    // Obtener metadata de tokens
    const tokenAContract = new Contract(tokenA, erc20Abi, provider);
    const tokenBContract = new Contract(tokenB, erc20Abi, provider);
    const [decA, symA, decB, symB] = await Promise.all([
      tokenAContract.decimals(),
      tokenAContract.symbol(),
      tokenBContract.decimals(),
      tokenBContract.symbol(),
    ]);

    let reserveDOA, reserveOther, symOther, decOther, decDOA;
    if (token0.toLowerCase() === doaAddress.toLowerCase()) {
      reserveDOA = reserve0;
      reserveOther = reserve1;
      symOther = symB;
      decOther = decB;
      decDOA = decA;
    } else {
      reserveDOA = reserve1;
      reserveOther = reserve0;
      symOther = symA;
      decOther = decA;
      decDOA = decB;
    }

    const humanDOA = formatUnits(reserveDOA, decDOA);
    const humanOther = formatUnits(reserveOther, decOther);
    const priceDOAinOther =
      Number(humanDOA) > 0 ? Number(humanOther) / Number(humanDOA) : 0;

    console.log(`📊 Reservas del par ${label}:`);
    console.log(`   DOA:   ${humanDOA}`);
    console.log(`   ${symOther}: ${humanOther}`);
    console.log(`💰 Precio DOA en ${symOther}: ${priceDOAinOther}\n`);
  } catch (err) {
    console.error(`⚠️ Error al consultar ${label}:`, err.shortMessage || err);
  }
}

async function main() {
  console.log("🔎 Consultando pares DOA en QuickSwap (Polygon mainnet)...\n");

  // Orden explícito para ver WPOL y WMATIC claramente
  const order = ["USDC", "USDT", "WMATIC", "WPOL", "POL", "WETH"];

  for (const symbol of order) {
    const address = baseTokens[symbol];
    await checkPair(doaAddress, address, `DOA/${symbol}`);
  }
}

main().catch((err) => {
  console.error("❌ Error en checkPair.js:", err);
});