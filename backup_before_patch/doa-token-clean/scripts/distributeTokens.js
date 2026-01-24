import { ethers } from "ethers";
import fs from "fs";

const cfg = JSON.parse(fs.readFileSync(new URL("../config/polygon-mainnet.json", import.meta.url), "utf-8"));
const investors = JSON.parse(fs.readFileSync(new URL("../data/investors.json", import.meta.url), "utf-8"));

const erc20Abi = [
  "function transfer(address to,uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(cfg.POLYGON_RPC);
  const wallet = new ethers.Wallet(cfg.POLYGON_PRIVATE_KEY, provider);
  const doa = new ethers.Contract(cfg.TOKEN_ADDRESS, erc20Abi, wallet);

  const dec = await doa.decimals();
  for (const { address, amount } of investors) {
    const amt = ethers.parseUnits(amount, dec);
    const tx = await doa.transfer(address, amt);
    console.log(`➡️ Transfer DOA to ${address} (${amount}) tx: ${tx.hash}`);
    await tx.wait();
  }
  console.log("✅ Distribución completada.");
}

main().catch(console.error);
