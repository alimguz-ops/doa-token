// scripts/mintTokens.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");
const minterWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";
const erc20Abi = [
  "function mint(address to, uint256 amount) public",
  "function decimals() view returns (uint8)"
];
const ownerAddress = "0x6377cd174b35f3630b6d0db695f175d5f0dc5541";

async function main() {
  if (!process.env.PRIVATE_KEY_ADMIN) throw new Error("❌ Falta PRIVATE_KEY_ADMIN en .env");
  if (!ethers.isAddress(doaAddress)) throw new Error(`❌ Dirección de contrato inválida: ${doaAddress}`);
  if (!ethers.isAddress(ownerAddress)) throw new Error(`❌ Dirección de Owner inválida: ${ownerAddress}`);

  const doaToken = new ethers.Contract(doaAddress, erc20Abi, minterWallet);

  const decimals = await doaToken.decimals();
  const amount = ethers.parseUnits("1000000", decimals);

  if (amount === 0n) {
    console.log("⚠️ Monto de mint es cero, abortando.");
    return;
  }

  console.log(`🚀 Minting ${ethers.formatUnits(amount, decimals)} DOA hacia Owner (${ownerAddress})...`);
  const tx = await doaToken.mint(ownerAddress, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  const receipt = await tx.wait();
  console.log(`✅ Mint confirmado en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);

  // Registro en archivo
  const logEntry = {
    date: new Date().toISOString(),
    to: ownerAddress,
    amount: ethers.formatUnits(amount, decimals),
    txHash: tx.hash,
    blockNumber: receipt.blockNumber
  };
  fs.appendFileSync("mint-log.json", JSON.stringify(logEntry) + "\n");

  console.log("🎉 Mint completado y registrado en mint-log.json");
}

main().catch((err) => {
  console.error("❌ Error en mint:", err);
  process.exitCode = 1;
});