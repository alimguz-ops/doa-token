import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  if (!config.rpcUrl || !config.privateKey) throw new Error("❌ Config incompleta");
  if (!ethers.isAddress(config.token.address)) throw new Error(`❌ Dirección de token inválida: ${config.token.address}`);

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);

  const factoryAbi = [
    "function getPair(address tokenA, address tokenB) view returns (address)",
    "function createPair(address tokenA, address tokenB) returns (address)"
  ];
  const routerAbi = [
    "function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken,uint amountETH,uint liquidity)",
    "function removeLiquidityETH(address token,uint liquidity,uint amountTokenMin,uint amountETHMin,address to,uint deadline) returns (uint amountToken,uint amountETH)",
    "event LiquidityAdded(address token,uint amountToken,uint amountETH,address to)",
    "event LiquidityRemoved(address token,uint liquidity,address to)"
  ];
  const erc20Abi = ["function approve(address spender,uint amount) returns (bool)"];

  const factory = new ethers.Contract(config.liquidity.factory, factoryAbi, wallet);
  const router = new ethers.Contract(config.liquidity.router, routerAbi, wallet);
  const token = new ethers.Contract(config.token.address, erc20Abi, wallet);

  console.log("\n🚀 Iniciando flujo maestro en Polygon Amoy...\n");

  // 1. Obtener o crear par
  let pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);
  if (pairAddress === ethers.ZeroAddress) {
    console.log("⚠️ Par no existe, creando...");
    const txCreate = await factory.createPair(config.token.address, config.liquidity.baseToken);
    await txCreate.wait();
    console.log("TX hash (createPair):", txCreate.hash);
    pairAddress = await factory.getPair(config.token.address, config.liquidity.baseToken);
  }
  console.log("✅ Par:", pairAddress);

  // 2. Añadir liquidez
  const amountToken = ethers.parseUnits(config.liquidity.liqTokenAmount, Number(config.token.decimals));
  const amountETH = ethers.parseEther(config.liquidity.liqBaseAmount);

  console.log("🔄 Aprobando tokens...");
  const txApprove = await token.approve(config.liquidity.router, amountToken);
  await txApprove.wait();
  console.log("✅ Tokens aprobados para el router");

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
  console.log("✅ Liquidez añadida. TX:", txLiquidity.hash);

  router.once("LiquidityAdded", (tokenAddr, amtToken, amtETH, to) => {
    console.log("📊 Evento LiquidityAdded:", {
      token: tokenAddr,
      amountToken: amtToken.toString(),
      amountETH: amtETH.toString(),
      to
    });
  });

  // 3. Actualizar config
  config.liquidity.pairAddress = pairAddress;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📂 Config actualizado con pairAddress.");

  // 4. Rollback: retirar liquidez (mock)
  console.log("🔄 Retirando liquidez (mock)...");
  const txRemove = await router.removeLiquidityETH(
    config.token.address,
    1, // mock liquidity
    0,
    0,
    config.token.owner,
    deadline
  );
  await txRemove.wait();
  console.log("✅ Liquidez retirada. TX:", txRemove.hash);

  router.once("LiquidityRemoved", (tokenAddr, liquidity, to) => {
    console.log("📊 Evento LiquidityRemoved:", {
      token: tokenAddr,
      liquidity: liquidity.toString(),
      to
    });
  });

  // Resetear config
  config.liquidity.pairAddress = "";
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📂 Config reseteado: pairAddress vacío.");

  console.log("\n🚀 Flujo maestro completado.\n");
}

main().catch(console.error);