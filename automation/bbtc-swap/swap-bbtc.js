// swap-bbtc.js
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

const RPC_URL = process.env.POLYGON_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY_SWAP_BBTC;

const USDT_ADDRESS = process.env.USDT_POLYGON_ADDRESS;        // USDT oficial en Polygon
const MATIC_ADDRESS = process.env.MATIC_POLYGON_ADDRESS;      // MATIC nativo en Polygon
const ROUTER_ADDRESS = process.env.ROUTER_QUICKSWAP_POLYGON;  // QuickSwap Router en Polygon
const OWNER_OKX_ADDRESS = process.env.OWNER_OKX_ADDRESS;

const splitMATICtoOKX = parseInt(process.env.SPLIT_MATIC_TO_OKX); // 28%

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const erc20ABI = [
  "function approve(address spender, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint)"
];
const routerABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"
];

const usdt = new ethers.Contract(USDT_ADDRESS, erc20ABI, wallet);
const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, wallet);

// Espera hasta que haya balance en Polygon
async function waitForPolygonBalance(contract, address, retries = 30, delay = 10000) {
  for (let i = 0; i < retries; i++) {
    const bal = await contract.balanceOf(address);
    if (!bal.isZero()) return bal;
    console.log(`⏳ Esperando balance en Polygon... intento ${i + 1}`);
    await new Promise(res => setTimeout(res, delay));
  }
  throw new Error("El balance en Polygon sigue siendo 0 después de esperar.");
}

async function swapAndSend() {
  try {
    console.log("🚀 swap-bbtc.js iniciado");

    const balanceUSDT = await waitForPolygonBalance(usdt, wallet.address);
    console.log("💵 Balance USDT en Polygon:", ethers.utils.formatUnits(balanceUSDT, 6));

    const deadline = Math.floor(Date.now() / 1000) + 600;
    const gasPrice = await provider.getGasPrice();
    const overrides = {
      maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      maxFeePerGas: gasPrice.add(ethers.utils.parseUnits("10", "gwei"))
    };

    // Aprobar USDT al router
    const txApprove = await usdt.approve(ROUTER_ADDRESS, balanceUSDT, overrides);
    await txApprove.wait();

    // Swap USDT → MATIC
    const txSwap = await router.swapExactTokensForTokens(
      balanceUSDT,
      0,
      [USDT_ADDRESS, MATIC_ADDRESS],
      wallet.address,
      deadline,
      overrides
    );
    await txSwap.wait();
    console.log("✅ Swap USDT→MATIC confirmado");

    // Enviar 28% de MATIC a OKX
    const balanceMATIC = await provider.getBalance(wallet.address);
    if (balanceMATIC.isZero()) throw new Error("No hay MATIC disponible en Polygon.");

    const amountOKX = balanceMATIC.mul(splitMATICtoOKX).div(100);

    const txSendMATIC = await wallet.sendTransaction({
      to: OWNER_OKX_ADDRESS,
      value: amountOKX,
      ...overrides
    });
    await txSendMATIC.wait();
    console.log("✅ MATIC enviado a OKX");

    // Log persistente
    const logEntry = {
      timestamp: new Date().toISOString(),
      balanceUSDT: ethers.utils.formatUnits(balanceUSDT, 6),
      balanceMATIC: ethers.utils.formatEther(balanceMATIC),
      split: { MATICtoOKX: `${splitMATICtoOKX}%` },
      txApprove: txApprove.hash,
      txSwap: txSwap.hash,
      txSendMATIC: txSendMATIC.hash,
      destinoOKX: OWNER_OKX_ADDRESS
    };

    fs.appendFileSync("swaps-bbtc.json", JSON.stringify(logEntry, null, 2) + ",\n");
    console.log("📊 Log guardado en swaps-bbtc.json");

  } catch (err) {
    console.error("❌ Error en swap-bbtc:", err);
  }
}

swapAndSend();
