import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(cfg.AMOY_RPC);

  const factoryAbi = [
    "function getPair(address tokenA, address tokenB) view returns (address)"
  ];
  const pairAbi = [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function totalSupply() view returns (uint256)"
  ];
  const erc20Abi = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)"
  ];

  const factory = new ethers.Contract(cfg.FACTORY_ADDRESS, factoryAbi, provider);

  console.log("\n🔎 Validando par DOA/WMATIC en QuickSwap (Amoy)...");
  const pairAddress = await factory.getPair(cfg.TOKEN_ADDRESS, cfg.BASE_TOKEN_ADDRESS);

  if (pairAddress === ethers.ZeroAddress) {
    console.log("❌ El par no existe aún. Crea el par y añade liquidez antes de validar.\n");
    return;
  }

  console.log("✅ Par encontrado:", pairAddress);
  const pair = new ethers.Contract(pairAddress, pairAbi, provider);

  // Fetch token metadata
  const tokenA = new ethers.Contract(cfg.TOKEN_ADDRESS, erc20Abi, provider);
  const tokenB = new ethers.Contract(cfg.BASE_TOKEN_ADDRESS, erc20Abi, provider);

  const [decA, decB, symA, symB] = await Promise.all([
    tokenA.decimals(),
    tokenB.decimals(),
    tokenA.symbol(),
    tokenB.symbol()
  ]);

  // Determine order (token0/token1) and reserves
  const [t0, t1] = await Promise.all([pair.token0(), pair.token1()]);
  const { reserve0, reserve1 } = await pair.getReserves();

  const reserveToken = t0.toLowerCase() === cfg.TOKEN_ADDRESS.toLowerCase() ? reserve0 : reserve1;
  const reserveBase  = t0.toLowerCase() === cfg.TOKEN_ADDRESS.toLowerCase() ? reserve1 : reserve0;

  const humanToken = Number(ethers.formatUnits(reserveToken, decA));
  const humanBase  = Number(ethers.formatUnits(reserveBase, decB));

  console.log(`📊 Reservas actuales:`);
  console.log(`- ${symA}: ${humanToken}`);
  console.log(`- ${symB}: ${humanBase}`);

  const lpTotal = await pair.totalSupply();
  console.log(`💧 LP total supply: ${ethers.formatUnits(lpTotal, 18)}\n`);

  const active = humanToken > 0 && humanBase > 0;
  if (active) {
    console.log("🚀 Estado: ACTIVO. El par tiene liquidez y puede tradearse en QuickSwap.\n");
  } else {
    console.log("⚠️ Estado: INACTIVO. Falta liquidez en uno o ambos lados. Añade liquidez para habilitar el trading.\n");
  }

  // Optional: save pair address in config if missing
  if (!cfg.PAIR_ADDRESS || cfg.PAIR_ADDRESS.toLowerCase() !== pairAddress.toLowerCase()) {
    cfg.PAIR_ADDRESS = pairAddress;
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
    console.log("📂 Config actualizado con PAIR_ADDRESS:", pairAddress);
  }
}

main().catch((err) => {
  console.error("Error en checkPair.js:", err);
  process.exitCode = 1;
});
