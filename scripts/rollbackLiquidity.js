import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

const routerAbi = [
  "function removeLiquidityETH(address token,uint liquidity,uint amountTokenMin,uint amountETHMin,address to,uint deadline) returns (uint amountToken,uint amountETH)"
];
const pairAbi = [
  "function balanceOf(address owner) view returns (uint)",
  "function approve(address spender,uint value) returns (bool)"
];

const router = new ethers.Contract(
  ethers.getAddress(config.liquidity.router),
  routerAbi,
  wallet
);
const pair = new ethers.Contract(
  ethers.getAddress(config.liquidity.pairAddress),
  pairAbi,
  wallet
);

console.log("\n🔄 Rollback automático: retirar liquidez y resetear configuración...\n");

const lpBalance = await pair.balanceOf(wallet.address);
if (lpBalance === 0n) {
  console.error("⚠️ No tienes liquidez en este par.");
  process.exit(1);
}

console.log("🔄 Aprobando LP tokens...");
await pair.approve(ethers.getAddress(config.liquidity.router), lpBalance);

console.log("🔄 Retirando liquidez...");
const deadline = Math.floor(Date.now() / 1000) + parseInt(config.liquidity.deadlineSeconds);
const txRemove = await router.removeLiquidityETH(
  ethers.getAddress(config.token.address),
  lpBalance,
  0,
  0,
  ethers.getAddress(config.token.owner),
  deadline
);
await txRemove.wait();
console.log("✅ Liquidez retirada.");

config.liquidity.pairAddress = "";
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log("📂 Configuración reseteada: pairAddress vacío.");

console.log("\n🚀 Rollback completo terminado.\n");
