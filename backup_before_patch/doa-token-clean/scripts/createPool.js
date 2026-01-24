// scripts/createPool.js
import { ethers } from "ethers";
import fs from "fs";

// Load config (Polygon Amoy)
const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/**
 * Usage:
 * node scripts/createPool.js WMATIC
 * node scripts/createPool.js USDC
 * node scripts/createPool.js DAI
 * node scripts/createPool.js USDT
 *
 * The script will:
 * - Create DOA/base pair if missing
 * - Add liquidity (native or ERC20 base)
 * - Save PAIR_ADDRESS_<SYMBOL> in config
 */
async function main() {
  const baseSymbol = process.argv[2];
  if (!baseSymbol) {
    console.error("Falta el símbolo del token base. Ej: node scripts/createPool.js USDC");
    process.exit(1);
  }

  // Resolve base token address by symbol from config map
  const baseMap = {
    WMATIC: cfg.BASE_TOKEN_ADDRESS,           // Native wrapped MATIC in Amoy
    USDC: cfg.USDC_ADDRESS,                   // Optional: add in polygon-amoy.json
    DAI: cfg.DAI_ADDRESS,                     // Optional: add in polygon-amoy.json
    USDT: cfg.USDT_ADDRESS                    // Optional: add in polygon-amoy.json
  };
  const baseAddress = baseMap[baseSymbol];
  if (!baseAddress) {
    console.error(`No encuentro dirección para ${baseSymbol}. Añádela en polygon-amoy.json (e.g., USDC_ADDRESS).`);
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(cfg.AMOY_RPC);
  const wallet = new ethers.Wallet(cfg.AMOY_PRIVATE_KEY, provider);

  const factoryAbi = [
    "function getPair(address tokenA, address tokenB) view returns (address)",
    "function createPair(address tokenA, address tokenB) returns (address)"
  ];
  const routerAbi = [
    // V2 Router
    "function addLiquidity(address tokenA,address tokenB,uint amountADesired,uint amountBDesired,uint amountAMin,uint amountBMin,address to,uint deadline) returns (uint amountA,uint amountB,uint liquidity)",
    "function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)"
  ];
  const erc20Abi = [
    "function approve(address spender,uint amount) returns (bool)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  const factory = new ethers.Contract(cfg.FACTORY_ADDRESS, factoryAbi, wallet);
  const router = new ethers.Contract(cfg.ROUTER_ADDRESS, routerAbi, wallet);
  const doa = new ethers.Contract(cfg.TOKEN_ADDRESS, erc20Abi, wallet);
  const base = new ethers.Contract(baseAddress, erc20Abi, wallet);

  console.log(`\n🔧 Crear/validar pool DOA/${baseSymbol} + añadir liquidez`);

  // Ensure pair exists
  let pairAddress = await factory.getPair(cfg.TOKEN_ADDRESS, baseAddress);
  if (pairAddress === ethers.ZeroAddress) {
    console.log("⚠️ Par no existe, creando...");
    const txCreate = await factory.createPair(cfg.TOKEN_ADDRESS, baseAddress);
    await txCreate.wait();
    pairAddress = await factory.getPair(cfg.TOKEN_ADDRESS, baseAddress);
    console.log("✅ Par creado:", pairAddress);
  } else {
    console.log("✅ Par ya existe:", pairAddress);
  }

  // Amounts and slippage
  const doaDecimals = await doa.decimals();
  const baseDecimals = await base.decimals().catch(() => 18); // WMATIC is 18, ERC20s vary

  const amountDOA = ethers.parseUnits(cfg.LIQ_TOKEN_AMOUNT, doaDecimals);
  const deadline = Math.floor(Date.now() / 1000) + parseInt(cfg.DEADLINE_SECONDS);

  // Slippage calculations (BPS = basis points)
  const bps = BigInt(cfg.SLIPPAGE_BPS); // e.g., 50 = 0.5%
  const bpsDen = 10_000n;

  // Approve DOA for router
  console.log("🔄 Aprobando DOA para el router...");
  await doa.approve(cfg.ROUTER_ADDRESS, amountDOA);

  // Native vs ERC20 base flow
  if (baseSymbol === "WMATIC" && cfg.BASE_IS_NATIVE === "true") {
    const amountBase = ethers.parseEther(cfg.LIQ_BASE_AMOUNT);
    const minDOA = amountDOA - (amountDOA * bps) / bpsDen;
    const minBase = amountBase - (amountBase * bps) / bpsDen;

    console.log("🔄 Añadiendo liquidez (ETH/POL nativo)...");
    const tx = await router.addLiquidityETH(
      cfg.TOKEN_ADDRESS,
      amountDOA,
      minDOA,
      minBase,
      wallet.address,
      deadline,
      { value: amountBase }
    );
    await tx.wait();
    console.log("✅ Liquidez añadida (DOA/WMATIC).");
  } else {
    // ERC20 base pair
    const amountBase = ethers.parseUnits(cfg.LIQ_BASE_AMOUNT, baseDecimals);
    const minDOA = amountDOA - (amountDOA * bps) / bpsDen;
    const minBase = amountBase - (amountBase * bps) / bpsDen;

    console.log(`🔄 Aprobando ${baseSymbol} para el router...`);
    await base.approve(cfg.ROUTER_ADDRESS, amountBase);

    console.log(`🔄 Añadiendo liquidez DOA/${baseSymbol} (ERC20)...`);
    const tx = await router.addLiquidity(
      cfg.TOKEN_ADDRESS,
      baseAddress,
      amountDOA,
      amountBase,
      minDOA,
      minBase,
      wallet.address,
      deadline
    );
    await tx.wait();
    console.log(`✅ Liquidez añadida (DOA/${baseSymbol}).`);
  }

  // Save pair by symbol
  const key = `PAIR_ADDRESS_${baseSymbol}`;
  cfg[key] = pairAddress;
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
  console.log(`📂 Guardado en config: ${key} = ${pairAddress}\n`);

  console.log("🚀 Pool listo para trading.");
}

main().catch((err) => {
  console.error("Error en createPool.js:", err);
  process.exitCode = 1;
});
