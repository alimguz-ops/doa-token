// scripts/quickCheck.js
// Verificación rápida de ETH (mainnet), USDT, MATIC y DOA (Polygon) en cuentas críticas

require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Providers
const ethProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_RPC_PRIMARY || process.env.ETH_RPC
);

const polygonProvider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC_PRIMARY || process.env.POLYGON_RPC
);

// ✅ Contratos en Polygon
const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// USDT oficial en Polygon
const usdtAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const usdtToken = new ethers.Contract(usdtAddress, erc20Abi, polygonProvider);

// DOA Token en Polygon (dirección real)
const doaAddress = "0x692d951163df3f7D9Fe071413F92c319D9B7369E";
const doaToken = new ethers.Contract(doaAddress, erc20Abi, polygonProvider);

// ✅ Direcciones críticas
const addresses = {
  Owner: "0x6377cd174b35f3630b6d0db695f175d5f0dc5541",       // Owner principal (1,000,000 DOA)
  Admin: "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5",       // Admin (200k DOA)
  Colaborador: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1", // Colaborador (250k DOA)
  Reserva: "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95",     // Binance Reserva (250k DOA)
  Comunidad: "0xD1f7a79CE44b267Dfe51B6F84008208550a30562",   // Comunidad (100k DOA)
  Binance: "0xb27df745fc43ca79f8250e52639594ae96315ef5"      // Binance wallet
};

async function main() {
  try {
    const usdtDecimals = await usdtToken.decimals();
    const doaDecimals = await doaToken.decimals();

    console.log("⚡ QuickCheck: ETH + USDT + MATIC + DOA balances\n");

    for (const [name, addr] of Object.entries(addresses)) {
      // ETH en mainnet
      const ethBalance = await ethProvider.getBalance(addr);

      // USDT en Polygon
      const usdtBalance = await usdtToken.balanceOf(addr);

      // MATIC en Polygon
      const maticBalance = await polygonProvider.getBalance(addr);

      // DOA en Polygon
      const doaBalance = await doaToken.balanceOf(addr);

      console.log(`${name} (${addr}):`);
      console.log(`   🪙 ${ethers.utils.formatEther(ethBalance)} ETH`);
      console.log(`   💵 ${ethers.utils.formatUnits(usdtBalance, usdtDecimals)} USDT`);
      console.log(`   💰 ${ethers.utils.formatEther(maticBalance)} MATIC`);
      console.log(`   🔹 ${ethers.utils.formatUnits(doaBalance, doaDecimals)} DOA\n`);
    }
  } catch (err) {
    console.error("❌ Error en QuickCheck:", err.message);
  }
}

main();
