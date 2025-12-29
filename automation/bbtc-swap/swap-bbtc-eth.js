// swap-bbtc-eth.js
// Flujo: BBTC (Ethereum) → USDT (Ethereum) + envío 68% a Binance

require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// --- Configuración desde .env ---
const RPC_URL = process.env.ETH_RPC; // RPC de Ethereum
const PRIVATE_KEY = process.env.PRIVATE_KEY_SWAP_BBTC;
const BBTC_ADDRESS = process.env.BBTC_ETH_ADDRESS; // WBTC/BBTC en Ethereum
const USDT_ADDRESS = process.env.USDT_ETH_ADDRESS; // USDT oficial en Ethereum
const ROUTER_UNISWAP = process.env.ROUTER_UNISWAP_ETH; // Uniswap V3 Router
const BINANCE_USDT_ADDRESS = process.env.BINANCE_USDT_ADDRESS;

// --- Porcentajes ---
const splitBinance = parseInt(process.env.SPLIT_BINANCE_USDT); // Ejemplo: 68

// Inicialización
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ABIs mínimos
const erc20ABI = [
  "function approve(address spender, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];
const routerABI = [
  "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint deadline, uint amountIn, uint amountOutMinimum, uint160 sqrtPriceLimitX96)) returns (uint amountOut)"
];

const router = new ethers.Contract(ROUTER_UNISWAP, routerABI, wallet);
const bbtc = new ethers.Contract(BBTC_ADDRESS, erc20ABI, wallet);
const usdt = new ethers.Contract(USDT_ADDRESS, erc20ABI, wallet);

async function swapAndSend(amountBBTC) {
  try {
    console.log("🚀 Iniciando swap-bbtc-eth.js con configuración:", {
      rpc: RPC_URL,
      wallet: wallet.address,
      splitBinance
    });

    const amountIn = ethers.utils.parseUnits(amountBBTC.toString(), 8); // BBTC/WBTC usa 8 decimales
    const deadline = Math.floor(Date.now() / 1000) + 600;

    // Aprobar BBTC al router
    const txApprove = await bbtc.approve(ROUTER_UNISWAP, amountIn);
    console.log("⏳ Aprobación enviada:", txApprove.hash);
    await txApprove.wait();
    console.log("✅ Aprobación confirmada");

    // Swap BBTC → USDT (Uniswap V3)
    const params = {
      tokenIn: BBTC_ADDRESS,
      tokenOut: USDT_ADDRESS,
      fee: 3000, // pool fee 0.3%
      recipient: wallet.address,
      deadline,
      amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    };

    const txSwap = await router.exactInputSingle(params);
    console.log("⏳ Swap BBTC→USDT enviado:", txSwap.hash);
    await txSwap.wait();
    console.log("✅ Swap BBTC→USDT confirmado");

    // Balance USDT recibido
    const balanceUSDT = await usdt.balanceOf(wallet.address);
    console.log("💰 Balance USDT recibido:", ethers.utils.formatUnits(balanceUSDT, 6));

    // Calcular split 68% → Binance
    const amountBinance = balanceUSDT.mul(splitBinance).div(100);

    // Transferir USDT a Binance
    const txSendUSDT = await usdt.transfer(BINANCE_USDT_ADDRESS, amountBinance);
    console.log("⏳ Transferencia USDT→Binance enviada:", txSendUSDT.hash);
    await txSendUSDT.wait();
    console.log("✅ USDT enviado a Binance");

    // Log persistente
    const logEntry = {
      timestamp: new Date().toISOString(),
      amountBBTC,
      split: { Binance: `${splitBinance}%`, Resto: `${100 - splitBinance}%` },
      txApprove: txApprove.hash,
      txSwap: txSwap.hash,
      txSendUSDT: txSendUSDT.hash,
      destinoBinance: BINANCE_USDT_ADDRESS
    };

    fs.appendFileSync("swaps-bbtc-eth.json", JSON.stringify(logEntry, null, 2) + ",\n");
    console.log("📊 Log guardado en swaps-bbtc-eth.json");

  } catch (err) {
    console.error("❌ Error en flujo Ethereum:", err);
  }
}

// Ejemplo de ejecución
swapAndSend("0.00178") // Ajusta al saldo BBTC real
  .then(() => console.log("✅ Flujo completado"))
  .catch(err => console.error("❌ Error en ejecución:", err));
