import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-mainnet.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

async function main() {
  if (!config.rpcUrl || !config.privateKey) throw new Error("❌ Config incompleta");
  if (!ethers.isAddress(config.token.address)) throw new Error(`❌ Dirección de token inválida: ${config.token.address}`);
  if (!ethers.isAddress(config.liquidity.baseToken)) throw new Error(`❌ Dirección de baseToken inválida: ${config.liquidity.baseToken}`);

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);

  const factoryAbi = ["function getPair(address tokenA, address tokenB) view returns (address)"];
  const routerAbi = ["function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)"];
  const erc20Abi = ["function approve(address spender,uint amount) returns (bool)"];
  const pairAbi = [
    "function getReserves() view returns (uint112,uint112,uint32)",
    "function balanceOf(address owner) view returns (uint)"
  ];

  console.log("\n🚀 Flujo maestro en Polygon mainnet...\n");

  const factory = new ethers.Contract(config.liquidity.factory, factoryAbi, wallet);
  const router = new ethers.Contract(config.liquidity.router, routerAbi, wallet);
  const token = new ethers.Contract(config.token.address, erc20Abi, wallet);

  // 1. Obtener par
  let pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);
  if (pairAddress === ethers.ZeroAddress) {
    console.log("⚠️ Par no existe, se creará al añadir liquidez.");
  } else {
    console.log("✅ Par encontrado:", pairAddress);
  }

  // 2. Añadir liquidez
  const amountToken = ethers.parseUnits(config.liquidity.liqTokenAmount, Number(config.token.decimals));
  const amountETH = ethers.parseEther(config.liquidity.liqBaseAmount);

  console.log("🔄 Aprobando tokens...");
  const receiptApprove = await (await token.approve(config.liquidity.router, amountToken)).wait();
  console.log("✅ Tokens aprobados. TX:", receiptApprove.hash, "Bloque:", receiptApprove.blockNumber);

  console.log("🔄 Añadiendo liquidez...");
  const deadline = Math.floor(Date.now() / 1000) + parseInt(config.liquidity.deadlineSeconds);
  const tx = await router.addLiquidityETH(
    config.token.address,
    amountToken,
    0,
    0,
    config.token.owner,
    deadline,
    { value: amountETH }
  );
  const receiptLiquidity = await tx.wait();
  console.log("✅ Liquidez añadida. TX:", receiptLiquidity.hash, "Bloque:", receiptLiquidity.blockNumber);

  // 3. Validar reservas
  pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);
  const pair = new ethers.Contract(pairAddress, pairAbi, provider);
  const [reserve0, reserve1, ts] = await pair.getReserves();
  console.log("📊 Reservas:", reserve0.toString(), reserve1.toString(), "Timestamp:", ts);

  // 4. Balance LP
  const lpBalance = await pair.balanceOf(config.token.owner);
  console.log("💼 Balance LP del owner:", ethers.formatUnits(lpBalance, 18));

  // 5. Actualizar config
  config.liquidity.pairAddress = pairAddress;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📂 Config actualizado con pairAddress.");

  // 6. Enlace de trading
  console.log(`🔗 Pool: https://quickswap.exchange/#/swap?inputCurrency=${config.token.address}&outputCurrency=${config.liquidity.baseToken}`);
}

main().catch(console.error);