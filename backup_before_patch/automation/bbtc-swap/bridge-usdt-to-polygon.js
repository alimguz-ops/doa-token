// bridge-usdt-to-polygon.js
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

const ETH_RPC = process.env.ETH_RPC;
const POLYGON_RPC = process.env.POLYGON_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY_SWAP_BBTC;

const USDT_ETH_ADDRESS = process.env.USDT_ETH_ADDRESS;
const USDT_POLYGON_ADDRESS = process.env.USDT_POLYGON_ADDRESS;
const MATIC_POLYGON_ADDRESS = process.env.MATIC_POLYGON_ADDRESS;
const ROUTER_QUICKSWAP = process.env.ROUTER_QUICKSWAP_POLYGON;
const OWNER_OKX_ADDRESS = process.env.OWNER_OKX_ADDRESS;

const splitUSDTtoMATIC = parseInt(process.env.SPLIT_USDT_TO_MATIC); // 32%
const splitMATICtoOKX = parseInt(process.env.SPLIT_MATIC_TO_OKX);   // 28%

const providerETH = new ethers.providers.JsonRpcProvider(ETH_RPC);
const providerPolygon = new ethers.providers.JsonRpcProvider(POLYGON_RPC);
const walletETH = new ethers.Wallet(PRIVATE_KEY, providerETH);
const walletPolygon = new ethers.Wallet(PRIVATE_KEY, providerPolygon);

const erc20ABI = [
  "function approve(address spender, uint amount) returns (bool)",
  "function balanceOf(address account) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];
const routerABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"
];

const usdtETH = new ethers.Contract(USDT_ETH_ADDRESS, erc20ABI, walletETH);
const usdtPolygon = new ethers.Contract(USDT_POLYGON_ADDRESS, erc20ABI, walletPolygon);
const routerPolygon = new ethers.Contract(ROUTER_QUICKSWAP, routerABI, walletPolygon);

const ROOT_CHAIN_MANAGER = process.env.ROOT_CHAIN_MANAGER;
const rootChainManagerABI = [
  "function depositFor(address user, address rootToken, bytes calldata depositData)"
];
const rootChainManager = new ethers.Contract(ROOT_CHAIN_MANAGER, rootChainManagerABI, walletETH);

async function waitForPolygonBalance(contract, address, retries = 30, delay = 10000) {
  for (let i = 0; i < retries; i++) {
    const bal = await contract.balanceOf(address);
    if (!bal.isZero()) return bal;
    console.log(`⏳ Esperando balance en Polygon... intento ${i + 1}`);
    await new Promise(res => setTimeout(res, delay));
  }
  throw new Error("El balance en Polygon sigue siendo 0 después de esperar.");
}

async function bridgeAndSwap() {
  try {
    console.log("🚀 bridge-usdt-to-polygon.js iniciado");

    const balanceUSDT_ETH = await usdtETH.balanceOf(walletETH.address);
    if (balanceUSDT_ETH.isZero()) throw new Error("No hay USDT disponible en Ethereum.");

    const amountBridge = balanceUSDT_ETH.mul(splitUSDTtoMATIC).div(100);

    const gasPriceETH = await providerETH.getGasPrice();
    const overridesETH = {
      maxPriorityFeePerGas: ethers.utils.parseUnits("3", "gwei"),
      maxFeePerGas: gasPriceETH.add(ethers.utils.parseUnits("10", "gwei"))
    };

    const txApprove = await usdtETH.approve(ROOT_CHAIN_MANAGER, amountBridge, overridesETH);
    await txApprove.wait();

    const depositData = ethers.utils.defaultAbiCoder.encode(["uint256"], [amountBridge]);
    const txBridge = await rootChainManager.depositFor(walletETH.address, USDT_ETH_ADDRESS, depositData, overridesETH);
    await txBridge.wait();
    console.log("✅ Bridge enviado a Polygon");

    // Esperar hasta que el balance aparezca en Polygon
    const balanceUSDT_Polygon = await waitForPolygonBalance(usdtPolygon, walletPolygon.address);
    console.log("💵 Balance USDT en Polygon:", ethers.utils.formatUnits(balanceUSDT_Polygon, 6));

    const deadline = Math.floor(Date.now() / 1000) + 600;
    const gasPricePolygon = await providerPolygon.getGasPrice();
    const overridesPolygon = {
      maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      maxFeePerGas: gasPricePolygon.add(ethers.utils.parseUnits("10", "gwei"))
    };

    const txApprovePolygon = await usdtPolygon.approve(ROUTER_QUICKSWAP, balanceUSDT_Polygon, overridesPolygon);
    await txApprovePolygon.wait();

    const txSwap = await routerPolygon.swapExactTokensForTokens(
      balanceUSDT_Polygon,
      0,
      [USDT_POLYGON_ADDRESS, MATIC_POLYGON_ADDRESS],
      walletPolygon.address,
      deadline,
      overridesPolygon
    );
    await txSwap.wait();
    console.log("✅ Swap USDT→MATIC confirmado");

    const balanceMATIC = await providerPolygon.getBalance(walletPolygon.address);
    const amountOKX = balanceMATIC.mul(splitMATICtoOKX).div(100);

    const txSendMATIC = await walletPolygon.sendTransaction({
      to: OWNER_OKX_ADDRESS,
      value: amountOKX,
      ...overridesPolygon
    });
    await txSendMATIC.wait();
    console.log("✅ MATIC enviado a OKX");

    fs.appendFileSync("bridge-usdt-to-polygon.json", JSON.stringify({
      timestamp: new Date().toISOString(),
      balanceUSDT_ETH: ethers.utils.formatUnits(balanceUSDT_ETH, 6),
      balanceUSDT_Polygon: ethers.utils.formatUnits(balanceUSDT_Polygon, 6),
      balanceMATIC: ethers.utils.formatEther(balanceMATIC),
      txApprove: txApprove.hash,
      txBridge: txBridge.hash,
      txApprovePolygon: txApprovePolygon.hash,
      txSwap: txSwap.hash,
      txSendMATIC: txSendMATIC.hash
    }, null, 2) + ",\n");

    console.log("📊 Log guardado en bridge-usdt-to-polygon.json");

  } catch (err) {
    console.error("❌ Error en bridge-usdt-to-polygon:", err);
  }
}

bridgeAndSwap();
