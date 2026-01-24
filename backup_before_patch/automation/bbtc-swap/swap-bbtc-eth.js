// swap-bbtc-eth.js
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = process.env.ETH_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY_SWAP_BBTC;
const BBTC_ADDRESS = process.env.BBTC_ETH_ADDRESS;            // BBTC en Ethereum
const USDT_ADDRESS = process.env.USDT_ETH_ADDRESS;            // USDT oficial
const ROUTER_ADDRESS = process.env.ROUTER_UNISWAP_ETH;        // Uniswap V3 Router
const BINANCE_USDT_ADDRESS = process.env.BINANCE_USDT_ADDRESS;

const splitBinance = parseInt(process.env.SPLIT_BINANCE_USDT); // Ejemplo: 68%

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const erc20ABI = [
  "function approve(address spender, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];
const routerABI = [
  "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint deadline, uint amountIn, uint amountOutMinimum, uint160 sqrtPriceLimitX96)) returns (uint amountOut)"
];

const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, wallet);
const bbtc = new ethers.Contract(BBTC_ADDRESS, erc20ABI, wallet);
const usdt = new ethers.Contract(USDT_ADDRESS, erc20ABI, wallet);

async function swapAndSend() {
  try {
    console.log("🚀 swap-bbtc-eth.js iniciado");

    const balanceBBTC = await bbtc.balanceOf(wallet.address);
    if (balanceBBTC.isZero()) throw new Error("No hay BBTC disponible en Ethereum.");

    const deadline = Math.floor(Date.now() / 1000) + 600;
    const gasPrice = await provider.getGasPrice();
    const overrides = {
      maxPriorityFeePerGas: ethers.utils.parseUnits("3", "gwei"),
      maxFeePerGas: gasPrice.add(ethers.utils.parseUnits("10", "gwei"))
    };

    const txApprove = await bbtc.approve(ROUTER_ADDRESS, balanceBBTC, overrides);
    await txApprove.wait();

    const params = {
      tokenIn: BBTC_ADDRESS,
      tokenOut: USDT_ADDRESS,
      fee: 3000,
      recipient: wallet.address,
      deadline,
      amountIn: balanceBBTC,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    };

    const txSwap = await router.exactInputSingle(params, overrides);
    await txSwap.wait();

    const balanceUSDT = await usdt.balanceOf(wallet.address);
    const amountBinance = balanceUSDT.mul(splitBinance).div(100);

    const txSendUSDT = await usdt.transfer(BINANCE_USDT_ADDRESS, amountBinance, overrides);
    await txSendUSDT.wait();

    fs.appendFileSync("swaps-bbtc-eth.json", JSON.stringify({
      timestamp: new Date().toISOString(),
      balanceBBTC: ethers.utils.formatUnits(balanceBBTC, 8),
      balanceUSDT: ethers.utils.formatUnits(balanceUSDT, 6),
      txApprove: txApprove.hash,
      txSwap: txSwap.hash,
      txSendUSDT: txSendUSDT.hash
    }, null, 2) + ",\n");

    console.log("📊 Log guardado en swaps-bbtc-eth.json");

  } catch (err) {
    console.error("❌ Error en swap-bbtc-eth:", err);
  }
}

swapAndSend();
