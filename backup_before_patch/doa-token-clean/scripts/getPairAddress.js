import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const provider = new ethers.JsonRpcProvider(config.rpcUrl);

const factoryAbi = [
  "function getPair(address tokenA, address tokenB) view returns (address)"
];

const factory = new ethers.Contract(config.liquidity.factory, factoryAbi, provider);

const pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);

if (pairAddress === ethers.ZeroAddress) {
  console.error("❌ El par aún no existe. Debes añadir liquidez primero.");
  process.exit(1);
}

console.log("✅ Dirección del par encontrada:", pairAddress);

// Actualizar config
config.liquidity.pairAddress = pairAddress;
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log("📂 Configuración actualizada en config/polygon-amoy.json");
