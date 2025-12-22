import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-mainnet.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

const routerAbi = [
  "function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)"
];
const erc20Abi = [
  "function approve(address spender,uint amount) returns (bool)"
];

const router = new ethers.Contract(config.liquidity.router, routerAbi, wallet);
const token = new ethers.Contract(config.token.address, erc20Abi, wallet);

async function main() {
  const amountToken = ethers.parseUnits(config.liquidity.liqTokenAmount, Number(config.token.decimals));
  const amountETH = ethers.parseEther(config.liquidity.liqBaseAmount);

  console.log("🔄 Aprobando tokens...");
  await token.approve(config.liquidity.router, amountToken);

  console.log("🔄 Añadiendo liquidez...");
  const deadline = Math.floor(Date.now() / 1000) + parseInt(config.liquidity.deadlineSeconds);
  const tx = await router.addLiquidityETH(
    config.token.address,
    amountToken,
    0,
    0,
    config.token.owner,
    deadline,
    { value: amountETH }
  );
  await tx.wait();

  console.log("✅ Liquidez añadida en QuickSwap.");
}

main().catch(console.error);
