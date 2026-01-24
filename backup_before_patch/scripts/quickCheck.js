// scripts/quickCheck.js
// Verificación rápida de ETH (mainnet), USDT, MATIC y DOA (Polygon) en cuentas críticas

require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Providers
if (!process.env.ETH_RPC && !process.env.ETH_RPC_PRIMARY) {
  throw new Error("❌ Falta ETH_RPC en .env");
}
if (!process.env.POLYGON_RPC && !process.env.POLYGON_RPC_PRIMARY) {
  throw new Error("❌ Falta POLYGON_RPC en .env");
}

const ethProvider = new ethers.JsonRpcProvider(
  process.env.ETH_RPC_PRIMARY || process.env.ETH_RPC
);

const polygonProvider = new ethers.JsonRpcProvider(
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
  Owner: "0x6377cd174b35f3630b6d0db695f175d5f0dc5541",
  Admin: "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5",
  Colaborador: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1",
  Reserva: "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95",
  Comunidad: "0xD1f7a79CE44b267Dfe51B6F84008208550a30562",
  Binance: "0xb27df745fc43ca79f8250e52639594ae96315ef5"
};

async function main() {
  try {
    const usdtDecimals = await usdtToken.decimals();
    const doaDecimals = await doaToken.decimals();

    const ethBlock = await ethProvider.getBlockNumber();
    const polygonBlock = await polygonProvider.getBlockNumber();

    console.log("⚡ QuickCheck: ETH + USDT + MATIC + DOA balances\n");
    console.log(`📦 ETH block: ${ethBlock}, Polygon block: ${polygonBlock}\n`);

    for (const [name, addr] of Object.entries(addresses)) {
      try {
        const ethBalance = await ethProvider.getBalance(addr);
        const usdtBalance = await usdtToken.balanceOf(addr);
        const maticBalance = await polygonProvider.getBalance(addr);
        const doaBalance = await doaToken.balanceOf(addr);

        console.log(`${name} (${addr}):`);
        console.log(`   🪙 ${ethers.formatEther(ethBalance)} ETH`);
        console.log(`   💵 ${ethers.formatUnits(usdtBalance, usdtDecimals)} USDT`);
        console.log(`   💰 ${ethers.formatEther(maticBalance)} MATIC`);
        console.log(`   🔹 ${ethers.formatUnits(doaBalance, doaDecimals)} DOA\n`);
      } catch (e) {
        console.error(`⚠️ Error consultando ${name} (${addr}):`, e.message);
      }
    }
  } catch (err) {
    console.error("❌ Error en QuickCheck:", err.message);
  }
}

main();