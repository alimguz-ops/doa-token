// scripts/checkAllBalances.js
// Verifica balances de MATIC, DOA, USDT, WETH, BBTC, WPOL en Polygon
// y ETH en mainnet, en todas las cuentas principales

require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const { execSync } = require("child_process");

// ✅ Providers con fallback
function getProvider(primary, fallback) {
  try {
    return new ethers.providers.JsonRpcProvider(primary);
  } catch (err) {
    console.warn("⚠️ RPC principal falló, usando fallback...");
    return new ethers.providers.JsonRpcProvider(fallback);
  }
}

const polygonProvider = getProvider(
  process.env.POLYGON_RPC_PRIMARY || process.env.POLYGON_RPC,
  process.env.POLYGON_RPC_FALLBACK || "https://rpc.ankr.com/polygon"
);

const ethProvider = getProvider(
  process.env.ETH_RPC_PRIMARY || process.env.ETH_RPC,
  process.env.ETH_RPC_FALLBACK || "https://rpc.ankr.com/eth"
);

// Direcciones de contratos en Polygon
const doaAddress   = "0x692d951163df3f7D9Fe071413F92c319D9B7369E"; // DOA proxy
const usdtAddress  = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT oficial
const wethAddress  = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH (ETH en Polygon)
const wpolAddress  = process.env.WPOL_POLYGON_ADDRESS;             // WPOL oficial
const bbtcAddress  = process.env.BBTC_POLYGON_ADDRESS || null;     // BBTC opcional

// ABI mínimo ERC20
const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Cuentas a auditar
const addresses = {
  Owner: "0x6377cd174b35f3630b6d0db695f175d5f0dc5541",
  Admin: "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5",
  Reserva: "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95",
  Comunidad: "0xD1f7a79CE44b267Dfe51B6F84008208550a30562",
  Colaborador: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1"
};

async function main() {
  const doaToken  = new ethers.Contract(doaAddress, erc20Abi, polygonProvider);
  const usdtToken = new ethers.Contract(usdtAddress, erc20Abi, polygonProvider);
  const wethToken = new ethers.Contract(wethAddress, erc20Abi, polygonProvider);
  const wpolToken = new ethers.Contract(wpolAddress, erc20Abi, polygonProvider);
  const bbtcToken = bbtcAddress ? new ethers.Contract(bbtcAddress, erc20Abi, polygonProvider) : null;

  const doaDecimals  = await doaToken.decimals();
  const usdtDecimals = await usdtToken.decimals();
  const wethDecimals = await wethToken.decimals();
  const wpolDecimals = await wpolToken.decimals();
  const bbtcDecimals = bbtcToken ? await bbtcToken.decimals() : 8;

  console.log("📊 Saldos actuales de las cuentas:\n");

  let csvContent = "Cuenta,Dirección,ETH,MATIC,DOA,USDT,WETH,WPOL,BBTC\n";

  for (const [name, addr] of Object.entries(addresses)) {
    // ETH en mainnet
    const ethBalance = await ethProvider.getBalance(addr);

    // Tokens en Polygon
    const maticBalance = await polygonProvider.getBalance(addr);
    const doaBalance   = await doaToken.balanceOf(addr);
    const usdtBalance  = await usdtToken.balanceOf(addr);
    const wethBalance  = await wethToken.balanceOf(addr);
    const wpolBalance  = await wpolToken.balanceOf(addr);
    const bbtcBalance  = bbtcToken ? await bbtcToken.balanceOf(addr) : 0;

    const formattedETH    = ethers.utils.formatEther(ethBalance);
    const formattedMATIC  = ethers.utils.formatEther(maticBalance);
    const formattedDOA    = ethers.utils.formatUnits(doaBalance, doaDecimals);
    const formattedUSDT   = ethers.utils.formatUnits(usdtBalance, usdtDecimals);
    const formattedWETH   = ethers.utils.formatUnits(wethBalance, wethDecimals);
    const formattedWPOL   = ethers.utils.formatUnits(wpolBalance, wpolDecimals);
    const formattedBBTC   = bbtcToken ? ethers.utils.formatUnits(bbtcBalance, bbtcDecimals) : "0";

    console.log(`${name} (${addr}):`);
    console.log(`   🪙 ${formattedETH} ETH`);
    console.log(`   💰 ${formattedMATIC} MATIC`);
    console.log(`   🔹 ${formattedDOA} DOA`);
    console.log(`   💵 ${formattedUSDT} USDT`);
    console.log(`   🌐 ${formattedWETH} WETH`);
    console.log(`   🌀 ${formattedWPOL} WPOL`);
    if (bbtcToken) console.log(`   🪙 ${formattedBBTC} BBTC`);
    console.log("");

    csvContent += `${name},${addr},${formattedETH},${formattedMATIC},${formattedDOA},${formattedUSDT},${formattedWETH},${formattedWPOL},${formattedBBTC}\n`;
  }

  fs.writeFileSync("balances.csv", csvContent);
  console.log("✅ Resultados guardados en balances.csv");

  try {
    execSync("git add balances.csv");
    execSync(`git commit -m "Auditoría automática de balances generales" --no-verify`);
    execSync("git push");
    console.log("📤 Archivo balances.csv subido y registrado en el repositorio Git (sin husky)");
  } catch (err) {
    console.error("⚠️ Error al subir a Git:", err.message);
  }
}

main().catch((err) => {
  console.error("❌ Error al consultar balances:", err);
});
