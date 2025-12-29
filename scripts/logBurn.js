// scripts/logBurn.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
const burnerWallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, burnerWallet);

  const decimals = await doaToken.decimals();
  const balance = await doaToken.balanceOf(burnerWallet.address);

  // 🔥 Ajusta el porcentaje aquí (ejemplo: 2%)
  const percentage = 2;
  const amount = balance * BigInt(percentage) / BigInt(100);

  const deadAddress = "0x000000000000000000000000000000000000dEaD";

  console.log(`🔥 Quemando ${ethers.formatUnits(amount, decimals)} DOA (${percentage}% del balance de ${burnerWallet.address})...`);
  const tx = await doaToken.transfer(deadAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  await tx.wait();

  const supply = await doaToken.totalSupply();

  // Registro en burn-log.json
  const logEntry = {
    date: new Date().toISOString(),
    quarter: "Q" + Math.ceil((new Date().getMonth() + 1) / 3),
    amount: ethers.formatUnits(amount, decimals),
    supplyAfter: ethers.formatUnits(supply, decimals),
    txHash: tx.hash
  };

  let logs = [];
  if (fs.existsSync("burn-log.json")) {
    logs = JSON.parse(fs.readFileSync("burn-log.json"));
  }
  logs.push(logEntry);
  fs.writeFileSync("burn-log.json", JSON.stringify(logs, null, 2));

  console.log("🎉 Burn completado y registrado en burn-log.json");
}

main().catch((err) => {
  console.error("❌ Error en logBurn:", err);
  process.exitCode = 1;
});
