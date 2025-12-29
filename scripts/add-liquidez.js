require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const routerAbi = [
    "function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)"
  ];

  const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, wallet);

  const token = process.env.TOKEN_ADDRESS;
  const amountTokenDesired = ethers.parseUnits(process.env.AMOUNT_DOA, 18);
  const amountTokenMin = 0;
  const amountETHMin = 0;
  const to = wallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  const tx = await router.addLiquidityETH(
    token,
    amountTokenDesired,
    amountTokenMin,
    amountETHMin,
    to,
    deadline,
    { value: ethers.parseEther(process.env.AMOUNT_MATIC) }
  );

  console.log("Transacción enviada:", tx.hash);
  await tx.wait();
  console.log("Liquidez añadida con éxito!");
}

main().catch(console.error);
