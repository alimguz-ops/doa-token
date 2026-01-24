// scripts/deployUniswapMocks.js
import { ethers } from "ethers";
import fs, { existsSync, mkdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function main() {
  console.log("🚀 Desplegando contratos Uniswap V2 Mock en Amoy...");

  // Factory
  const FactoryArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json"));
  const Factory = new ethers.ContractFactory(FactoryArtifact.abi, FactoryArtifact.bytecode, wallet);
  const factory = await Factory.deploy(wallet.address);
  await factory.waitForDeployment();
  console.log("✅ Factory:", await factory.getAddress(), "TX:", factory.deploymentTransaction().hash);

  // WETH
  const WETHArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/WETH.sol/WETH.json"));
  const WETHContract = new ethers.ContractFactory(WETHArtifact.abi, WETHArtifact.bytecode, wallet);
  const weth = await WETHContract.deploy();
  await weth.waitForDeployment();
  console.log("✅ WETH:", await weth.getAddress(), "TX:", weth.deploymentTransaction().hash);

  // Router Mock
  const RouterArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/UniswapV2Router02Mock.sol/UniswapV2Router02Mock.json"));
  const Router = new ethers.ContractFactory(RouterArtifact.abi, RouterArtifact.bytecode, wallet);
  const router = await Router.deploy(await factory.getAddress(), await weth.getAddress());
  await router.waitForDeployment();
  console.log("✅ Router Mock:", await router.getAddress(), "TX:", router.deploymentTransaction().hash);

  // Actualizar config
  const configPath = new URL("../config/polygon-amoy.json", import.meta.url);
  if (!existsSync(path.dirname(configPath))) {
    mkdirSync(path.dirname(configPath), { recursive: true });
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.liquidity.factory = await factory.getAddress();
  config.liquidity.router = await router.getAddress();
  config.liquidity.baseToken = await weth.getAddress();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📂 Configuración actualizada con direcciones reales.");
}

main().catch((err) => {
  console.error("❌ Error en deployUniswapMocks.js:", err);
  process.exitCode = 1;
});