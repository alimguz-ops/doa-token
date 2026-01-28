// scripts/createPool.js (ESM + ethers v6)
// Flujo completo: crear/validar pool DOA/baseToken + añadir liquidez
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const baseSymbol = process.argv[2];
  if (!baseSymbol) {
    console.error("Falta el símbolo del token base. Ej: node scripts/createPool.js USDC");
    process.exit(1);
  }

  const baseMap = {
    WMATIC: process.env.WMATIC_ADDRESS,
    USDC: process.env.USDC_POLYGON_ADDRESS,
    DAI: process.env.DAI_POLYGON_ADDRESS,
    USDT: process.env.USDT_POLYGON_ADDRESS
  };

  const baseAddress = baseMap[baseSymbol];
  if (!baseAddress) {
    console.error(`No encuentro dirección para ${baseSymbol}. Añádela en .env`);
    process.exit(1);
  }

  // ✅ Provider correcto en ethers v6
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER, provider);

  const factoryAbi = [
    "function getPair(address tokenA, address tokenB) view returns (address)",
    "function createPair(address tokenA, address tokenB) returns (address)"
  ];
  const routerAbi = [
    "function addLiquidity(address tokenA,address tokenB,uint amountADesired,uint amountBDesired,uint amountAMin,uint amountBMin,address to,uint deadline) returns (uint amountA,uint amountB,uint liquidity)",
    "function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)"
  ];
  const erc20Abi = [
    "function approve(address spender,uint amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ];

  const factory = new ethers.Contract(process.env.FACTORY_ADDRESS, factoryAbi, wallet);
  const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, wallet);
  const doa = new ethers.Contract(process.env.CONTRACT_ADDRESS, erc20Abi, wallet);
  const base = new ethers.Contract(baseAddress, erc20Abi, wallet);

  console.log(`\n🔧 Crear/validar pool DOA/${baseSymbol} + añadir liquidez`);

  // 1. Verificar/crear par
  let pairAddress = await factory.getPair(process.env.CONTRACT_ADDRESS, baseAddress);
  if (pairAddress === ethers.ZeroAddress) {
    console.log("⚠️ Par no existe, creando...");
    const txCreate = await factory.createPair(process.env.CONTRACT_ADDRESS, baseAddress);
    await txCreate.wait();
    pairAddress = await factory.getPair(process.env.CONTRACT_ADDRESS, baseAddress);
    console.log("✅ Par creado:", pairAddress);
  } else {
    console.log("✅ Par ya existe:", pairAddress);
  }

  // 2. Obtener decimales
  const doaDecimals = await doa.decimals();
  const baseDecimals = await base.decimals();

  // 3. Montos de liquidez desde .env
  const amountDOA = ethers.parseUnits(process.env.LIQ_TOKEN_AMOUNT, doaDecimals);
  const amountBase = ethers.parseUnits(process.env.LIQ_BASE_AMOUNT, baseDecimals);
  const deadline = Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS || "1200");

  // 4. Aprobar tokens
  console.log("🔄 Aprobando tokens...");
  await doa.approve(process.env.ROUTER_ADDRESS, amountDOA);
  await base.approve(process.env.ROUTER_ADDRESS, amountBase);
  console.log("✅ Tokens aprobados");

  // 5. Añadir liquidez
  console.log("🔄 Añadiendo liquidez...");
  const txLiquidity = await router.addLiquidity(
    process.env.CONTRACT_ADDRESS,
    baseAddress,
    amountDOA,
    amountBase,
    0,
    0,
    process.env.TOKEN_OWNER,
    deadline
  );
  await txLiquidity.wait();
  console.log("✅ Liquidez añadida. TX:", txLiquidity.hash);

  console.log("\n🚀 Flujo completo terminado.\n");
}

main().catch((err) => {
  console.error("❌ Error en createPool.js:", err);
  process.exitCode = 1;
});
