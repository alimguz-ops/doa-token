import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-mainnet.json", import.meta.url);
const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(cfg.POLYGON_RPC);
  const wallet = new ethers.Wallet(cfg.POLYGON_PRIVATE_KEY, provider);

  // Mostrar dirección pública
  console.log("\n🔎 Dirección de la wallet:", wallet.address);

  // Balance actual de MATIC
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance actual:", ethers.formatEther(balance), "MATIC");

  // Estimar gas para una transacción típica (ejemplo: createPair)
  const factoryAbi = [
    "function createPair(address tokenA, address tokenB) returns (address)"
  ];
  const factory = new ethers.Contract(cfg.FACTORY_ADDRESS, factoryAbi, wallet);

  try {
    const gasEstimate = await factory.createPair.estimateGas(
      cfg.TOKEN_ADDRESS,
      cfg.WMATIC_ADDRESS
    );
    const gasPrice = await provider.getGasPrice();

    const totalCost = ethers.formatEther(gasEstimate * gasPrice);
    console.log("\n⛽ Estimación de gas para createPair:");
    console.log("   - Gas units:", gasEstimate.toString());
    console.log("   - Gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    console.log("   - Costo total:", totalCost, "MATIC");
  } catch (err) {
    console.log("\n⚠️ No se pudo estimar gas (probablemente el par ya existe o falta liquidez).");
  }

  console.log("\n🚀 checkGas.js terminado.\n");
}

main().catch((err) => {
  console.error("Error en checkGas.js:", err);
  process.exitCode = 1;
});
