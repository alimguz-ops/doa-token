// scripts/distributeInvestors.js
import { ethers } from "ethers";
import fs from "fs";

const cfg = JSON.parse(fs.readFileSync(new URL("../config/polygon-mainnet.json", import.meta.url), "utf-8"));
const investors = JSON.parse(fs.readFileSync(new URL("../data/investors.json", import.meta.url), "utf-8"));

const erc20Abi = [
  "function transfer(address to,uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)"
];

async function main() {
  if (!cfg.POLYGON_RPC) throw new Error("❌ Falta POLYGON_RPC en config");
  if (!cfg.POLYGON_PRIVATE_KEY) throw new Error("❌ Falta POLYGON_PRIVATE_KEY en config");
  if (!cfg.TOKEN_ADDRESS || !ethers.isAddress(cfg.TOKEN_ADDRESS)) {
    throw new Error(`❌ TOKEN_ADDRESS inválido: ${cfg.TOKEN_ADDRESS}`);
  }

  const provider = new ethers.JsonRpcProvider(cfg.POLYGON_RPC);
  const wallet = new ethers.Wallet(cfg.POLYGON_PRIVATE_KEY, provider);
  console.log("🚀 Ejecutando distribución desde Admin:", await wallet.getAddress());

  const doa = new ethers.Contract(cfg.TOKEN_ADDRESS, erc20Abi, wallet);
  const dec = await doa.decimals();

  for (const { address, amount } of investors) {
    if (!ethers.isAddress(address)) {
      console.error(`❌ Dirección inválida: ${address}`);
      continue;
    }
    if (!amount) {
      console.error(`❌ Monto inválido para ${address}`);
      continue;
    }

    const amt = ethers.parseUnits(amount, dec);
    try {
      const tx = await doa.transfer(address, amt);
      console.log(`➡️ Transfer DOA to ${address} (${amount}) tx: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`📦 Bloque: ${receipt.blockNumber}`);

      const balance = await doa.balanceOf(address);
      console.log(`📊 Balance final de ${address}: ${ethers.formatUnits(balance, dec)} DOA`);
    } catch (e) {
      console.error(`❌ Error al transferir a ${address}:`, e.message);
    }
  }

  console.log("✅ Distribución completada.");
}

main().catch(console.error);