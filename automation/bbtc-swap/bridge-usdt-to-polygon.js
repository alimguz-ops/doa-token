// bridge-usdt-to-polygon.js
// Flujo real: USDT (Ethereum) → Polygon → MATIC → envío 28% a OKX

require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// --- Configuración desde .env ---
const ETH_RPC = process.env.ETH_RPC; // RPC Ethereum
const POLYGON_RPC = process.env.POLYGON_RPC; // RPC Polygon
const PRIVATE_KEY = process.env.PRIVATE_KEY_SWAP_BBTC;

const USDT_ETH_ADDRESS = process.env.USDT_ETH_ADDRESS; // USDT en Ethereum
const USDT_POLYGON_ADDRESS = process.env.USDT_POLYGON_ADDRESS; // USDT en Polygon
const MATIC_POLYGON_ADDRESS = process.env.MATIC_POLYGON_ADDRESS; // MATIC nativo en Polygon

const ROUTER_QUICKSWAP = process.env.ROUTER_QUICKSWAP_POLYGON; // QuickSwap Router
const OWNER_OKX_ADDRESS = process.env.OWNER_OKX_ADDRESS;

// --- Porcentajes ---
const splitUSDTtoMATIC = parseInt(process.env.SPLIT_USDT_TO_MATIC); // Ejemplo: 32
const splitMATICtoOKX = parseInt(process.env.SPLIT_MATIC_TO_OKX);   // Ejemplo: 28

// Inicialización
const providerETH = new ethers.providers.JsonRpcProvider(ETH_RPC);
const providerPolygon = new ethers.providers.JsonRpcProvider(POLYGON_RPC);
const walletETH = new ethers.Wallet(PRIVATE_KEY, providerETH);
const walletPolygon = new ethers.Wallet(PRIVATE_KEY, providerPolygon);

// ABIs mínimos
const erc20ABI = [
  "function approve(address spender, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];
const routerABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"
];

// Contratos
const usdtETH = new ethers.Contract(USDT_ETH_ADDRESS, erc20ABI, walletETH);
const usdtPolygon = new ethers.Contract(USDT_POLYGON_ADDRESS, erc20ABI, walletPolygon);
const routerPolygon = new ethers.Contract(ROUTER_QUICKSWAP, routerABI, walletPolygon);

// Contrato del Polygon Bridge (RootChainManager en Ethereum)
const ROOT_CHAIN_MANAGER = "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77";
const rootChainManagerABI = [
  "function depositFor(address user, address rootToken, bytes calldata depositData)"
];
const rootChainManager = new ethers.Contract(ROOT_CHAIN_MANAGER, rootChainManagerABI, walletETH);

async function bridgeAndSwap() {
  try {
    console.log("🚀 Iniciando bridge-usdt-to-polygon.js con configuración:", {
      splitUSDTtoMATIC,
      splitMATICtoOKX
    });

    // Balance USDT en Ethereum
    const balanceUSDT_ETH = await usdtETH.balanceOf(walletETH.address);
    console.log("💰 Balance USDT en Ethereum:", ethers.utils.formatUnits(balanceUSDT_ETH, 6));

    // Calcular 32% para bridge
    const amountBridge = balanceUSDT_ETH.mul(splitUSDTtoMATIC).div(100);

    // --- Paso 1: Aprobar USDT al RootChainManager ---
    const txApprove = await usdtETH.approve(ROOT_CHAIN_MANAGER, amountBridge);
    console.log("⏳ Aprobación USDT→Bridge enviada:", txApprove.hash);
    await txApprove.wait();
    console.log("✅ Aprobación confirmada");

    // --- Paso 2: Bridge USDT Ethereum → Polygon ---
    const depositData = ethers.utils.defaultAbiCoder.encode(["uint256"], [amountBridge]);
    const txBridge = await rootChainManager.depositFor(walletETH.address, USDT_ETH_ADDRESS, depositData);
    console.log("⏳ Bridge USDT→Polygon enviado:", txBridge.hash);
    await txBridge.wait();
    console.log("✅ USDT bridged a Polygon");

    // --- Paso 3: Swap USDT → MATIC en Polygon ---
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const balanceUSDT_Polygon = await usdtPolygon.balanceOf(walletPolygon.address);

    const txApprovePolygon = await usdtPolygon.approve(ROUTER_QUICKSWAP, balanceUSDT_Polygon);
    await txApprovePolygon.wait();

    const txSwap = await routerPolygon.swapExactTokensForTokens(
      balanceUSDT_Polygon,
      0,
      [USDT_POLYGON_ADDRESS, MATIC_POLYGON_ADDRESS],
      walletPolygon.address,
      deadline
    );
    console.log("⏳ Swap USDT→MATIC enviado:", txSwap.hash);
    await txSwap.wait();
    console.log("✅ Swap USDT→MATIC confirmado");

    // --- Paso 4: Enviar 28% de MATIC a OKX ---
    const balanceMATIC = await providerPolygon.getBalance(walletPolygon.address);
    const amountOKX = balanceMATIC.mul(splitMATICtoOKX).div(100);

    const txSendMATIC = await walletPolygon.sendTransaction({
      to: OWNER_OKX_ADDRESS,
      value: amountOKX
    });
    console.log("⏳ Transferencia MATIC→OKX enviada:", txSendMATIC.hash);
    await txSendMATIC.wait();
    console.log("✅ MATIC enviado a OKX");

    // Log persistente
    const logEntry = {
      timestamp: new Date().toISOString(),
      split: { USDTtoMATIC: `${splitUSDTtoMATIC}%`, MATICtoOKX: `${splitMATICtoOKX}%` },
      txApprove: txApprove.hash,
      txBridge: txBridge.hash,
      txApprovePolygon: txApprovePolygon.hash,
      txSwap: txSwap.hash,
      txSendMATIC: txSendMATIC.hash,
      destinoOKX: OWNER_OKX_ADDRESS
    };

    fs.appendFileSync("bridge-usdt-to-polygon.json", JSON.stringify(logEntry, null, 2) + ",\n");
    console.log("📊 Log guardado en bridge-usdt-to-polygon.json");

  } catch (err) {
    console.error("❌ Error en flujo Polygon:", err);
  }
}

bridgeAndSwap()
  .then(() => console.log("✅ Flujo completado"))
  .catch(err => console.error("❌ Error en ejecución:", err));
