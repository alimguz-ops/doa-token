import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);

  const factoryAbi = [
    "function getPair(address tokenA, address tokenB) view returns (address)",
    "function createPair(address tokenA, address tokenB) returns (address)"
  ];
  const routerAbi = [
    "function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)"
  ];
  const erc20Abi = [
    "function approve(address spender,uint amount) returns (bool)"
  ];

  const factory = new ethers.Contract(config.liquidity.factory, factoryAbi, wallet);
  const router = new ethers.Contract(config.liquidity.router, routerAbi, wallet);
  const token = new ethers.Contract(config.token.address, erc20Abi, wallet);

  console.log("\n🔎 Flujo automático: crear par + añadir liquidez + actualizar config + validar reservas...\n");

  let pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);
  if (pairAddress === ethers.ZeroAddress) {
    console.log("⚠️ Par no existe, creando...");
    const txCreate = await factory.createPair(config.token.address, config.liquidity.baseToken);
    await txCreate.wait();
    pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);
    console.log("✅ Par creado:", pairAddress);
  } else {
    console.log("✅ Par ya existe:", pairAddress);
  }

  const amountToken = ethers.parseUnits(config.liquidity.liqTokenAmount, config.token.decimals);
  const amountETH = ethers.parseEther(config.liquidity.liqBaseAmount);

  console.log("🔄 Aprobando tokens...");
  await token.approve(config.liquidity.router, amountToken);

  console.log("🔄 Añadiendo liquidez...");
  const deadline = Math.floor(Date.now() / 1000) + parseInt(config.liquidity.deadlineSeconds);
  const txLiquidity = await router.addLiquidityETH(
    config.token.address,
    amountToken,
    0,
    0,
    config.token.owner,
    deadline,
    { value: amountETH }
  );
  await txLiquidity.wait();
  console.log("✅ Liquidez añadida.");

  config.liquidity.pairAddress = pairAddress;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📂 Configuración actualizada con pairAddress:", pairAddress);

  console.log("\n🚀 Flujo completo terminado.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
