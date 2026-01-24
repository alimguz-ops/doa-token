// scripts/pipelineAll.mjs
import hardhat from "hardhat";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "fs";
import path from "path";

const { ethers, run } = hardhat;

function sh(cmd, env = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });
}

function loadJson(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!existsSync(abs)) throw new Error(`Config no encontrado: ${abs}`);
  return JSON.parse(readFileSync(abs, "utf8"));
}

function assertAddress(addr, label) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) throw new Error(`Dirección inválida para ${label}: ${addr}`);
}

async function main() {
  // Config única de red
  const networkKey = process.argv[2] || "polygon-amoy";
  const cfg = loadJson(`config/${networkKey}.json`);

  // Campos esperados
  const requiredTop = ["rpcUrl", "privateKey", "polygonscanApiKey", "token", "liquidity"];
  for (const k of requiredTop) if (!cfg[k]) throw new Error(`Falta clave en config: ${k}`);
  const reqToken = ["name", "symbol", "supply", "decimals", "owner"];
  for (const k of reqToken) if (!cfg.token[k]) throw new Error(`Falta token.${k}`);
  const reqLiq = ["router", "factory", "reservePercent", "liqTokenAmount", "liqBaseAmount", "slippageBps", "deadlineSeconds"];
  for (const k of reqLiq) if (!cfg.liquidity[k]) throw new Error(`Falta liquidity.${k}`);

  // Variables derivadas
  process.env.POLYGONSCAN_API_KEY = cfg.polygonscanApiKey;
  const provider = new ethers.JsonRpcProvider(cfg.rpcUrl);
  const signer = new ethers.Wallet(cfg.privateKey, provider);

  // 1) Compilar
  await run("compile");

  // 2) Deploy si no existe
  let tokenAddress = cfg.token.address || "";
  if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    const initialSupply = ethers.parseUnits(cfg.token.supply, cfg.token.decimals);
    const DoaToken = await ethers.getContractFactory("DoaToken");
    const doa = await DoaToken.deploy(
      cfg.token.name,
      cfg.token.symbol,
      initialSupply,
      cfg.token.owner,
      Number(cfg.liquidity.reservePercent)
    );
    await doa.waitForDeployment();
    tokenAddress = await doa.getAddress();
    console.log("Token deployed:", tokenAddress);
  }
  assertAddress(tokenAddress, "TOKEN_ADDRESS");

  // 3) Verificar en Polygonscan
  try {
    await run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [
        cfg.token.name,
        cfg.token.symbol,
        ethers.parseUnits(cfg.token.supply, cfg.token.decimals),
        cfg.token.owner,
        Number(cfg.liquidity.reservePercent)
      ]
    });
    console.log("Contract verified");
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("Already Verified")) {
      console.log("Contract already verified");
    } else {
      throw e;
    }
  }

  // 4) Check par y reservas
  const routerAbi = [
    "function WETH() view returns (address)",
    "function getAmountsOut(uint amountIn, address[] calldata path) view returns (uint[] memory)",
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable returns (uint amountToken, uint amountETH, uint liquidity)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)"
  ];
  const factoryAbi = ["function getPair(address tokenA, address tokenB) view returns (address)"];
  const pairAbi = ["function getReserves() view returns (uint112,uint112,uint32)"];

  const router = new ethers.Contract(cfg.liquidity.router, routerAbi, signer);
  const factory = new ethers.Contract(cfg.liquidity.factory, factoryAbi, provider);
  const wmatic = await router.WETH();

  let pair = await factory.getPair(tokenAddress, wmatic);
  const hasPair = pair && pair !== ethers.ZeroAddress;
  console.log("Pair:", hasPair ? pair : "no existe");

  // 5) Añadir liquidez si no hay par o si reservas están en 0
  const erc20Abi = ["function approve(address,uint256) returns (bool)", "function decimals() view returns (uint8)", "function balanceOf(address) view returns (uint256)"];
  const token = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const tokenDecimals = await token.decimals();

  const liqTokenAmount = ethers.parseUnits(cfg.liquidity.liqTokenAmount, tokenDecimals);
  const liqBaseAmount = ethers.parseEther(cfg.liquidity.liqBaseAmount);
  const slippageBps = BigInt(cfg.liquidity.slippageBps);
  const deadline = Math.floor(Date.now() / 1000) + Number(cfg.liquidity.deadlineSeconds);

  let needLiquidity = true;
  if (hasPair) {
    const pairC = new ethers.Contract(pair, pairAbi, provider);
    const [r0, r1] = await pairC.getReserves();
    needLiquidity = (r0 === 0n && r1 === 0n);
  }

  if (needLiquidity) {
    await (await token.approve(cfg.liquidity.router, liqTokenAmount)).wait();
    const minToken = liqTokenAmount - (liqTokenAmount * slippageBps / 10000n);
    const minBase = liqBaseAmount - (liqBaseAmount * slippageBps / 10000n);

    const tx = await router.addLiquidityETH(
      tokenAddress,
      liqTokenAmount,
      minToken,
      minBase,
      signer.address,
      deadline,
      { value: liqBaseAmount }
    );
    const rcpt = await tx.wait();
    console.log(`Liquidity added, tx: ${rcpt.hash}, block: ${rcpt.blockNumber}, gas: ${rcpt.gasUsed}`);

    pair = await factory.getPair(tokenAddress, wmatic);
    console.log("Pair refreshed:", pair);
  }

  // 6) Validar reservas y quote
  const pairC2 = new ethers.Contract(pair, pairAbi, provider);
  const [res0, res1] = await pairC2.getReserves();
  if (res0 === 0n && res1 === 0n) throw new Error("Reservas 0: liquidez no añadida correctamente");
  try {
    const quote = await router.getAmountsOut(ethers.parseEther("0.01"), [wmatic, tokenAddress]);
    console.log("Quote MATIC->DOA:", quote.map(x => x.toString()));
  } catch (err) {
    console.error("❌ Error obteniendo quote:", err);
  }

  // 7) Test de compra/venta mínimo
  const buyAmount = ethers.parseEther("0.02");
  const buyQuote = await router.getAmountsOut(buyAmount, [wmatic, tokenAddress]);
  const buyMin = buyQuote[1] - (buyQuote[1] * slippageBps / 10000n);
  const txBuy = await router.swapExactETHForTokens(buyMin, [wmatic, tokenAddress], signer.address, deadline, { value: buyAmount });
  await txBuy.wait();
  console.log("Buy OK");

  const sellAmount = buyQuote[1] / 2n;
  await (await token.approve(cfg.liquidity.router, sellAmount)).wait();
  const sellQuote = await router.getAmountsOut(sellAmount, [tokenAddress, wmatic]);
  const sellMin = sellQuote[1] - (sellQuote[1] * slippageBps / 10000n);
  const txSell = await router.swapExactTokensForETH(sellAmount, sellMin, [tokenAddress, wmatic], signer.address, deadline);
  await txSell.wait();
  console.log("Sell OK");

  // 8) Validaciones extendidas y reportes
  console.log("🧪 Ejecutando validaciones extendidas...");
  try { sh("node scripts/validateToken.cjs"); } catch (e) { console.error("Error en validateToken:", e); }
  try { sh("node scripts/validateLiquidity.js"); } catch (e) { console.error("Error en validateLiquidity:", e); }
  try { sh("node scripts/validateReserves.js"); } catch (e) { console.error("Error en validateReserves:", e); }
  try { sh("node scripts/testSwaps.cjs");