import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-mainnet.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const provider = new ethers.JsonRpcProvider(config.rpcUrl);

const factoryAbi = [
  "function getPair(address tokenA, address tokenB) view returns (address)"
];
const pairAbi = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112,uint112,uint32)",
  "function balanceOf(address owner) view returns (uint)"
];

async function main() {
  const factory = new ethers.Contract(config.liquidity.factory, factoryAbi, provider);
  const pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);

  if (pairAddress === ethers.ZeroAddress) {
    console.log("❌ El par aún no existe.");
    return;
  }

  console.log("✅ Par:", pairAddress);
  const pair = new ethers.Contract(pairAddress, pairAbi, provider);

  const [reserve0, reserve1] = await pair.getReserves();
  console.log("📊 Reservas:", reserve0.toString(), reserve1.toString());

  const lpBalance = await pair.balanceOf(config.token.owner);
  console.log("💼 Balance LP del owner:", lpBalance.toString());

  console.log(`🔗 Pool: https://quickswap.exchange/#/swap?inputCurrency=${config.token.address}&outputCurrency=${config.liquidity.baseToken}`);
}

main().catch(console.error);
