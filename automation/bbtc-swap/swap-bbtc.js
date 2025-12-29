// swap-bbtc.js
// Flujo completo: BBTC → USDT/MATIC + envío a Binance y owner (split dinámico desde .env)

require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Configuración desde .env
const RPC_URL = process.env.POLYGON_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY_SWAP_BBTC;
const BBTC_ADDRESS = process.env.BBTC_ADDRESS;
const USDT_ADDRESS = process.env.USDT_ADDRESS;
const MATIC_ADDRESS = process.env.MATIC_ADDRESS; // debe ser 0x000...1010
const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;
const BINANCE_USDT_ADDRESS = process.env.BINANCE_USDT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

// --- Lectura de porcentajes desde .env ---
const splitUSDT = parseInt(process.env.SPLIT_USDT);
const splitMATIC = parseInt(process.env.SPLIT_MATIC);

// Inicialización
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ABIs mínimos
const erc20ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint)",
  "function approve(address spender, uint amount) returns (bool)"
];
const routerABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"
];

const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, wallet);
const bbtc = new ethers.Contract(BBTC_ADDRESS, erc20ABI, wallet);
const usdt = new ethers.Contract(USDT_ADDRESS, erc20ABI, wallet);

async function swapAndSend(amountBBTC) {
  try {
    console.log("🚀 Iniciando swap-bbtc.js con configuración:", {
      rpc: RPC_URL,
      wallet: wallet.address,
      splitUSDT,
      splitMATIC
    });

    const amountIn = ethers.utils.parseUnits(amountBBTC.toString(), 18);

    // Aprobar BBTC al router
    const txApprove = await bbtc.approve(ROUTER_ADDRESS, amountIn);
    console.log("⏳ Aprobación enviada:", txApprove.hash);
    await txApprove.wait();
    console.log("✅ Aprobación confirmada");

    // Split dinámico
    const amountUSDT = amountIn.mul(splitUSDT).div(100);
    const amountMATIC = amountIn.mul(splitMATIC).div(100);
    const deadline = Math.floor(Date.now() / 1000) + 600;

    // Swap BBTC → USDT
    const txUSDT = await router.swapExactTokensForTokens(
      amountUSDT,
      0,
      [BBTC_ADDRESS, USDT_ADDRESS],
      wallet.address,
      deadline
    );
    console.log("⏳ Swap BBTC→USDT enviado:", txUSDT.hash);
    await txUSDT.wait();
    console.log("✅ Swap BBTC→USDT confirmado");

    // Swap BBTC → MATIC
    const txMATIC = await router.swapExactTokensForTokens(
      amountMATIC,
      0,
      [BBTC_ADDRESS, MATIC_ADDRESS],
      wallet.address,
      deadline
    );
    console.log("⏳ Swap BBTC→MATIC enviado:", txMATIC.hash);
    await txMATIC.wait();
    console.log("✅ Swap BBTC→MATIC confirmado");

    // Enviar USDT a Binance
    const balanceUSDT = await usdt.balanceOf(wallet.address);
    const gasPriceUSDT = await provider.getGasPrice();
    const gasLimitUSDT = await usdt.estimateGas.transfer(BINANCE_USDT_ADDRESS, balanceUSDT);
    const txSendUSDT = await usdt.transfer(BINANCE_USDT_ADDRESS, balanceUSDT, {
      gasPrice: gasPriceUSDT,
      gasLimit: gasLimitUSDT
    });
    console.log("⏳ Transferencia USDT→Binance enviada:", txSendUSDT.hash);
    await txSendUSDT.wait();
    console.log("✅ USDT enviado a Binance");

    // Enviar MATIC a Owner (solo lo recibido del swap, no todo el balance)
    const maticBalance = await provider.getBalance(wallet.address);
    const gasPriceMATIC = await provider.getGasPrice();
    const txSendMATIC = await wallet.sendTransaction({
      to: OWNER_ADDRESS,
      value: maticBalance.sub(ethers.utils.parseUnits("0.05", "ether")), // deja 0.05 MATIC para gas
      gasPrice: gasPriceMATIC
    });
    console.log("⏳ Transferencia MATIC→Owner enviada:", txSendMATIC.hash);
    await txSendMATIC.wait();
    console.log("✅ MATIC enviado a Owner");

    // Log persistente
    const logEntry = {
      timestamp: new Date().toISOString(),
      amountBBTC,
      split: { USDT: `${splitUSDT}%`, MATIC: `${splitMATIC}%` },
      txApprove: txApprove.hash,
      txUSDT: txUSDT.hash,
      txMATIC: txMATIC.hash,
      txSendUSDT: txSendUSDT.hash,
      destinoBinance: BINANCE_USDT_ADDRESS,
      txSendMATIC: txSendMATIC.hash,
      destinoOwner: OWNER_ADDRESS
    };

    fs.appendFileSync("swaps-bbtc.json", JSON.stringify(logEntry, null, 2) + ",\n");
    console.log("📊 Log guardado en swaps-bbtc.json");

  } catch (err) {
    console.error("❌ Error en flujo unificado:", err);
  }
}

// Ejemplo de ejecución
swapAndSend("0.00178")
  .then(() => console.log("✅ Flujo completado"))
  .catch(err => console.error("❌ Error en ejecución:", err));
