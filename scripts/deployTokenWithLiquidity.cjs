const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { ethers } = require("hardhat");

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable .env: ${name}`);
  return v;
}

function toWei(amount, decimals = 18) {
  return ethers.parseUnits(String(amount), decimals);
}

function nowPlus(seconds) {
  return Math.floor(Date.now() / 1000) + Number(seconds);
}

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8") || "[]");
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function main() {
  const OWNER_ADDRESS = required("OWNER_ADDRESS");
  const ROUTER_ADDRESS = required("ROUTER_ADDRESS");
  const FACTORY_ADDRESS = required("FACTORY_ADDRESS");

  const BASE_TOKEN_ADDRESS = process.env.BASE_TOKEN_ADDRESS || "";

  const LIQ_TOKEN_AMOUNT = required("LIQ_TOKEN_AMOUNT");
  const LIQ_BASE_AMOUNT = required("LIQ_BASE_AMOUNT");
  const SLIPPAGE_BPS = Number(process.env.SLIPPAGE_BPS || "50");
  const DEADLINE_SECONDS = Number(process.env.DEADLINE_SECONDS || "1800");

  const TOKEN_NAME = required("TOKEN_NAME");
  const TOKEN_SYMBOL = required("TOKEN_SYMBOL");
  const TOKEN_DECIMALS = Number(process.env.TOKEN_DECIMALS || "18");
  const TOKEN_SUPPLY = required("TOKEN_SUPPLY");
  const RESERVE_PERCENT = Number(process.env.RESERVE_PERCENT || "20");

  // Provider y signer
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);
  const wallet = new ethers.Wallet(process.env.AMOY_PRIVATE_KEY, provider);

  // Deploy token
  const TokenFactory = await ethers.getContractFactory("DoaToken", wallet);
  const initialSupply = toWei(TOKEN_SUPPLY, TOKEN_DECIMALS);
  const token = await TokenFactory.deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    initialSupply,
    OWNER_ADDRESS,
    RESERVE_PERCENT
  );
  await token.waitForDeployment();
  console.log(`Token desplegado en: ${token.target}`);

  // Router y Factory con signer
  const routerAbi = [
    "function addLiquidity(address,address,uint,uint,uint,uint,address,uint) returns (uint,uint,uint)"
  ];
  const factoryAbi = [
    "function getPair(address,address) external view returns (address)",
    "function createPair(address,address) external returns (address)"
  ];
  const router = new ethers.Contract(ROUTER_ADDRESS, routerAbi, wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, wallet);

  // Base token
  let baseTokenForPair = BASE_TOKEN_ADDRESS;

  // Crear par si es posible
  let pair;
  try {
    pair = await factory.getPair(token.target, baseTokenForPair);
    if (pair === ethers.ZeroAddress) {
      const tx = await factory.createPair(token.target, baseTokenForPair);
      await tx.wait();
      pair = await factory.getPair(token.target, baseTokenForPair);
      console.log(`Par creado: ${pair}`);
    } else {
      console.log(`Par existente: ${pair}`);
    }
  } catch (e) {
    console.log("⚠️ Factory en Amoy no responde a getPair/createPair, se omite.");
    pair = "0x0000000000000000000000000000000000000000";
  }

  // Añadir liquidez
  const amountTokenDesired = toWei(LIQ_TOKEN_AMOUNT, TOKEN_DECIMALS);
  const minToken = (amountTokenDesired * BigInt(10000 - SLIPPAGE_BPS)) / 10000n;
  const deadline = nowPlus(DEADLINE_SECONDS);

  await (await token.approve(ROUTER_ADDRESS, amountTokenDesired)).wait();

  const base = new ethers.Contract(
    baseTokenForPair,
    ["function approve(address,uint256) external returns (bool)"],
    wallet
  );
  const amountBaseDesired = toWei(LIQ_BASE_AMOUNT, 18);
  const minBase = (amountBaseDesired * BigInt(10000 - SLIPPAGE_BPS)) / 10000n;
  try {
    await (await base.approve(ROUTER_ADDRESS, amountBaseDesired)).wait();
    const tx = await router.addLiquidity(
      token.target,
      baseTokenForPair,
      amountTokenDesired,
      amountBaseDesired,
      minToken,
      minBase,
      OWNER_ADDRESS,
      deadline
    );
    await tx.wait();
    console.log("Liquidez añadida contra WMATIC");
  } catch (e) {
    console.log("⚠️ Router en Amoy no responde a addLiquidity, se omite.");
  }

  // Guardar en deployments.json
  const deploymentsFile = path.join(process.cwd(), "deployments.json");
  const history = readJson(deploymentsFile);
  history.push({
    timestamp: Date.now(),
    network: "polygonAmoy",
    token: token.target,
    pair,
    router: ROUTER_ADDRESS,
    factory: FACTORY_ADDRESS,
    reservePercent: RESERVE_PERCENT,
    liquidity: { token: LIQ_TOKEN_AMOUNT, base: LIQ_BASE_AMOUNT }
  });
  writeJson(deploymentsFile, history);
  console.log("Registro guardado en deployments.json");
}

main().catch(console.error);

// Ejecutar reporte completo automáticamente
const { execSync } = require("child_process");
try {
  console.log("\n📊 Generando reporte completo...");
  execSync("npx hardhat run scripts/deploymentsFullReport.cjs", { stdio: "inherit" });

  console.log("\n⬆️ Subiendo reportes a Git...");
  execSync("npx hardhat run scripts/pushReports.cjs", { stdio: "inherit" });
} catch (e) {
  console.log("⚠️ No se pudo generar o subir el reporte automáticamente:", e.message);
}
