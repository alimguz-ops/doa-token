// scripts/verifyPools.js
import dotenv from "dotenv";
import fs from "fs";
import { ethers } from "ethers";
import { execSync } from "child_process";

dotenv.config();

// Providers
const polygonProvider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
const ethProvider = new ethers.JsonRpcProvider(process.env.ETH_RPC);

// Factories
const quickswapFactoryAddr = "0x5757371414417b8c6caad45baef941abc7d3ab32"; // QuickSwap V2 Factory (Polygon)
const uniswapFactoryAddr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // Uniswap V2 Factory (Ethereum)

const factoryAbi = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];
const pairAbi = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

// Decimales conocidos
const tokenDecimals = {
  // Polygon
  "0x692d951163df3f7d9fe071413f92c319d9b7369e": 18, // DOA Polygon
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": 18, // WPOL
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": 6,  // USDC
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": 6,  // USDT
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": 18, // DAI
  // Ethereum
  "0x6F52809EfdDF5826956EeF9C289A661624afb0cE": 18, // DOA Ethereum
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 18, // WETH Ethereum
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": 6   // USDT Ethereum
};

async function verifyPair(provider, factoryAddr, tokenA, tokenB, network) {
  try {
    const factory = new ethers.Contract(factoryAddr, factoryAbi, provider);
    const pairAddr = await factory.getPair(tokenA, tokenB);

    if (pairAddr === ethers.ZeroAddress) {
      console.log(`❌ No existe par ${tokenA}/${tokenB} en 🌐 ${network}`);
      return null;
    }

    const pair = new ethers.Contract(pairAddr, pairAbi, provider);
    const [reserve0, reserve1, blockTimestampLast] = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    const decimals0 = tokenDecimals[token0.toLowerCase()] || 18;
    const decimals1 = tokenDecimals[token1.toLowerCase()] || 18;

    const r0 = ethers.formatUnits(reserve0, decimals0);
    const r1 = ethers.formatUnits(reserve1, decimals1);

    console.log(`✅ Par encontrado en 🌐 ${network}: ${token0} / ${token1} (${pairAddr})`);
    console.log(`   📦 Reservas → ${Number(r0).toFixed(4)} / ${Number(r1).toFixed(4)}`);
    console.log(`   🕒 Última actualización: ${blockTimestampLast}`);

    let priceDOA = null;
    if (token0.toLowerCase() === "0x692d951163df3f7d9fe071413f92c319d9b7369e" ||
        token0.toLowerCase() === "0x6f52809efddf5826956eef9c289a661624afb0ce") {
      priceDOA = parseFloat(r1) / parseFloat(r0);
      console.log(`   💰 Precio DOA → ${priceDOA.toFixed(6)} ${token1}`);
    } else if (token1.toLowerCase() === "0x692d951163df3f7d9fe071413f92c319d9b7369e" ||
               token1.toLowerCase() === "0x6f52809efddf5826956eef9c289a661624afb0ce") {
      priceDOA = parseFloat(r0) / parseFloat(r1);
      console.log(`   💰 Precio DOA → ${priceDOA.toFixed(6)} ${token0}`);
    }

    return {
      network,
      pairAddress: pairAddr,
      token0,
      token1,
      reserve0: r0,
      reserve1: r1,
      blockTimestampLast: Number(blockTimestampLast),
      priceDOA
    };
  } catch (err) {
    console.error(`❌ Error verificando par ${tokenA}/${tokenB} en ${network}:`, err.message);
    return null;
  }
}

async function main() {
  const logsDir = "logs";
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
    console.log("📂 Carpeta logs creada.");
  }

  const pairs = JSON.parse(fs.readFileSync("pairs.json"));
  const results = [];
  let csvContent = "Network,PairAddress,Token0,Token1,Reserve0,Reserve1,BlockTimestampLast,PriceDOA\n";

  for (const pair of pairs) {
    let provider, factoryAddr;
    if (pair.network === "Polygon") {
      provider = polygonProvider;
      factoryAddr = quickswapFactoryAddr;
    } else if (pair.network === "Ethereum") {
      provider = ethProvider;
      factoryAddr = uniswapFactoryAddr;
    } else {
      console.error(`❌ Red desconocida: ${pair.network}`);
      continue;
    }

    const result = await verifyPair(provider, factoryAddr, pair.tokenA, pair.tokenB, pair.network);
    if (result) {
      results.push(result);
      csvContent += `${result.network},${result.pairAddress},${result.token0},${result.token1},${result.reserve0},${result.reserve1},${result.blockTimestampLast},${result.priceDOA || ""}\n`;
    }
  }

  // Guardar JSON
  const jsonPath = `${logsDir}/pools.json`;
  let history = [];
  if (fs.existsSync(jsonPath)) {
    const content = fs.readFileSync(jsonPath, "utf8");
    if (content.trim().length > 0) {
      history = JSON.parse(content);
    }
  }
  history.push({ timestamp: new Date().toISOString(), results });
  fs.writeFileSync(jsonPath, JSON.stringify(history, null, 2));
  console.log(`📑 Histórico guardado en ${jsonPath}`);

  // Guardar CSV
  const csvPath = `${logsDir}/pools.csv`;
  fs.writeFileSync(csvPath, csvContent);
  console.log(`📑 Resultados guardados en ${csvPath}`);

  // Subir a Git (si no está ignorado)
  try {
    execSync(`git add ${csvPath} ${jsonPath}`);
    execSync(`git commit -m "Auditoría automática de pools de liquidez" --no-verify`);
    execSync("git push");
    console.log("📤 Archivos pools.csv y pools.json subidos y registrados en el repositorio Git (sin husky)");
  } catch (err) {
    console.error("⚠️ Error al subir a Git:", err.message);
  }
}

main().catch((err) => {
  console.error("❌ Error general:", err.message);
});
