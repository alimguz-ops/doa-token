// scripts/checkAllBalances.js
// Verifica balances en Polygon (MATIC, DOA, USDT, WETH, WPOL)
// y en Ethereum (ETH, DOA, USDT, WETH), en todas las cuentas principales
// Guarda resultados en balances.csv y balances.json (histórico)

import dotenv from "dotenv";
import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import { execSync } from "child_process";

dotenv.config();

// ✅ Providers
const polygonProvider = hre.ethers.provider;
const ethProvider = new ethers.JsonRpcProvider(
  process.env.ETH_RPC || "https://rpc.ankr.com/eth"
);

// ✅ Tokens en Polygon
const polygonTokens = {
  DOA:  { address: "0x692d951163df3f7D9Fe071413F92c319D9B7369E", decimals: 18 },
  USDT: { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
  WETH: { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
  WPOL: { address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", decimals: 18 }
};

// ✅ Tokens en Ethereum
const ethereumTokens = {
  DOA:  { address: "0x6F52809EfdDF5826956EeF9C289A661624afb0cE", decimals: 18 },
  USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
  WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 }
};

// ABI mínimo ERC20
const erc20Abi = ["function balanceOf(address account) view returns (uint256)"];

// ✅ Cuentas a auditar
const addresses = {
  Owner: "0x6377cd174b35f3630b6d0db695f175d5f0dc5541",
  Admin: "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5",
  Reserva: "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95",
  Comunidad: "0xD1f7a79CE44b267Dfe51B6F84008208550a30562",
  Colaborador: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1"
};

async function getTokenBalance(provider, tokenInfo, addr) {
  const token = new ethers.Contract(tokenInfo.address, erc20Abi, provider);
  const balance = await token.balanceOf(addr);
  return ethers.formatUnits(balance, tokenInfo.decimals);
}

async function main() {
  console.log("📊 Saldos actuales de las cuentas:\n");

  let csvContent = "Cuenta,Dirección,ETH,MATIC,DOA_Polygon,USDT_Polygon,WETH_Polygon,WPOL,DOA_Ethereum,USDT_Ethereum,WETH_Ethereum\n";
  const jsonResults = [];

  for (const [name, addr] of Object.entries(addresses)) {
    // ETH y MATIC nativos
    const ethBalance   = await ethProvider.getBalance(addr);
    const maticBalance = await polygonProvider.getBalance(addr);

    // Tokens en Polygon
    const doaPolygon   = await getTokenBalance(polygonProvider, polygonTokens.DOA, addr);
    const usdtPolygon  = await getTokenBalance(polygonProvider, polygonTokens.USDT, addr);
    const wethPolygon  = await getTokenBalance(polygonProvider, polygonTokens.WETH, addr);
    const wpolBalance  = await getTokenBalance(polygonProvider, polygonTokens.WPOL, addr);

    // Tokens en Ethereum
    const doaEthereum  = await getTokenBalance(ethProvider, ethereumTokens.DOA, addr);
    const usdtEthereum = await getTokenBalance(ethProvider, ethereumTokens.USDT, addr);
    const wethEthereum = await getTokenBalance(ethProvider, ethereumTokens.WETH, addr);

    const formattedETH   = ethers.formatEther(ethBalance);
    const formattedMATIC = ethers.formatEther(maticBalance);

    console.log(`${name} (${addr}):`);
    console.log(`   🪙 ${formattedETH} ETH`);
    console.log(`   💰 ${formattedMATIC} MATIC`);
    console.log(`   🔹 Polygon → DOA: ${doaPolygon}, USDT: ${usdtPolygon}, WETH: ${wethPolygon}, WPOL: ${wpolBalance}`);
    console.log(`   🌐 Ethereum → DOA: ${doaEthereum}, USDT: ${usdtEthereum}, WETH: ${wethEthereum}`);
    console.log("");

    csvContent += `${name},${addr},${formattedETH},${formattedMATIC},${doaPolygon},${usdtPolygon},${wethPolygon},${wpolBalance},${doaEthereum},${usdtEthereum},${wethEthereum}\n`;

    jsonResults.push({
      account: name,
      address: addr,
      balances: {
        ETH: formattedETH,
        MATIC: formattedMATIC,
        Polygon: { DOA: doaPolygon, USDT: usdtPolygon, WETH: wethPolygon, WPOL: wpolBalance },
        Ethereum: { DOA: doaEthereum, USDT: usdtEthereum, WETH: wethEthereum }
      },
      timestamp: new Date().toISOString()
    });
  }

  // Guardar CSV
  fs.writeFileSync("balances.csv", csvContent);
  console.log("✅ Resultados guardados en balances.csv");

  // Guardar histórico JSON
  const logPath = "balances.json";
  let history = [];
  if (fs.existsSync(logPath)) {
    const content = fs.readFileSync(logPath, "utf8");
    if (content.trim().length > 0) {
      history = JSON.parse(content);
    }
  }
  history.push(...jsonResults);
  fs.writeFileSync(logPath, JSON.stringify(history, null, 2));
  console.log("✅ Histórico guardado en balances.json");

  try {
    execSync("git add balances.csv balances.json");
    execSync(`git commit -m "Auditoría automática de balances generales" --no-verify`);
    execSync("git push");
    console.log("📤 Archivos balances.csv y balances.json subidos y registrados en el repositorio Git (sin husky)");
  } catch (err) {
    console.error("⚠️ Error al subir a Git:", err.message);
  }
}

main().catch((err) => {
  console.error("❌ Error al consultar balances:", err);
  process.exitCode = 1;
});
