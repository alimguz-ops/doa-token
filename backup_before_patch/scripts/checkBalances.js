// scripts/checkBalances.js
require("dotenv").config();
const { JsonRpcProvider, Contract, formatEther, formatUnits } = require("ethers");

// ✅ Provider Polygon (v6)
const provider = new JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Tokens en Polygon
const tokens = {
  MATIC: null, // nativo
  USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  DAI:  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
  WPOL: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  DOA:  "0x692d951163df3f7D9Fe071413F92c319D9B7369E"
};

// Lista de direcciones públicas a revisar
const addresses = {
  COLLABORATOR: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1",
  RESERVE:      "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95",
  COMMUNITY:    "0xD1f7a79CE44b267Dfe51B6F84008208550a30562",
  ADMIN:        "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5",
  OWNER:        "0x6377cd174b35f3630b6d0db695f175d5f0dc5541",
  BINANCE:      "0xb27df745fc43ca79f8250e52639594ae96315ef5"
};

// LP tokens
const lpTokens = {
  DOA_USDC: "0x79Ea824CCC9D3CB6fdc735305e44f7Bb0Ef69799"
};

async function checkBalance(address, tokenAddr, name) {
  if (!tokenAddr) {
    // MATIC nativo
    const balance = await provider.getBalance(address);
    const balanceFormatted = formatEther(balance);
    console.log(`🔎 ${name} balance: ${balanceFormatted}`);
    return;
  }

  const token = new Contract(tokenAddr, erc20Abi, provider);
  const decimals = await token.decimals();
  const symbol = await token.symbol();
  const balance = await token.balanceOf(address);

  const balanceFormatted = formatUnits(balance, decimals);
  console.log(`🔎 ${symbol} balance: ${balanceFormatted}`);
}

async function checkLPBalance(address, lpAddr, name) {
  const lp = new Contract(lpAddr, erc20Abi, provider);
  const decimals = await lp.decimals();
  const symbol = await lp.symbol();
  const balance = await lp.balanceOf(address);

  const balanceFormatted = formatUnits(balance, decimals);
  console.log(`💧 LP ${name} balance: ${balanceFormatted} ${symbol}`);
}

async function main() {
  for (const [label, addr] of Object.entries(addresses)) {
    console.log(`👤 Checking balances for ${label}: ${addr}\n`);

    // Tokens normales
    for (const [name, tokenAddr] of Object.entries(tokens)) {
      try {
        await checkBalance(addr, tokenAddr, name);
      } catch (err) {
        console.log(`❌ Error checking ${name}: ${err.message}`);
      }
      console.log("----");
    }

    // Solo LP balance para OWNER
    if (label === "OWNER") {
      for (const [name, lpAddr] of Object.entries(lpTokens)) {
        try {
          await checkLPBalance(addr, lpAddr, name);
        } catch (err) {
          console.log(`❌ Error checking LP ${name}: ${err.message}`);
        }
        console.log("----");
      }
    }

    console.log("\n============================\n");
  }
}

main().catch((err) => {
  console.error("❌ Error al consultar balances:", err);
  process.exitCode = 1;
});