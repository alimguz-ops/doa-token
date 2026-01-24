import { ethers } from "ethers";
import fs from "fs";

const RPC_URL = "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = "0x2231c3100a1e142017b5a3feee7f45d8a3caa937ed995ed09d9b2bb90a917f39";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function main() {
  console.log("🚀 Desplegando contratos Uniswap V2 Mock en Amoy...");

  // Factory
  const FactoryArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json"));
  const Factory = new ethers.ContractFactory(FactoryArtifact.abi, FactoryArtifact.bytecode, wallet);
  const factory = await Factory.deploy(wallet.address);
  await factory.waitForDeployment();
  console.log("✅ Factory:", await factory.getAddress());

  // WETH
  const WETHArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/WETH.sol/WETH.json"));
  const WETHContract = new ethers.ContractFactory(WETHArtifact.abi, WETHArtifact.bytecode, wallet);
  const weth = await WETHContract.deploy();
  await weth.waitForDeployment();
  console.log("✅ WETH:", await weth.getAddress());

  // Router Mock
  const RouterArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/UniswapV2Router02Mock.sol/UniswapV2Router02Mock.json"));
  const Router = new ethers.ContractFactory(RouterArtifact.abi, RouterArtifact.bytecode, wallet);
  const router = await Router.deploy(await factory.getAddress(), await weth.getAddress());
  await router.waitForDeployment();
  console.log("✅ Router Mock:", await router.getAddress());

  // Actualizar config
  const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.liquidity.factory = await factory.getAddress();
  config.liquidity.router = await router.getAddress();
  config.liquidity.baseToken = await weth.getAddress();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📂 Configuración actualizada con direcciones reales.");
}

main().catch(console.error);
