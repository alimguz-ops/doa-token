// scripts/checkBalances.js
require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC);

const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Tokens en Polygon
const tokens = {
  MATIC: null, // nativo
  USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // ETH envuelto en Polygon
  USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  DAI:  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
  WPOL: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  DOA:  "0x692d951163df3f7d9fe071413f92c319d9b7369e"
};

// Lista de direcciones públicas a revisar
const addresses = {
  COLLABORATOR: "0xe3baefcbad73d05512deaad182ed0cf8b3a5e7b1", // 250k DOA
  RESERVE:      "0xfe7522c992ab5193ba66195ccbef65e3b0b76f95", // 250k DOA
  COMMUNITY:    "0xD1f7a79CE44b267Dfe51B6F84008208550a30562", // 100k DOA
  ADMIN:        "0xf224bc9a97e0e605c0546f9ced88aaf2228cf6c5", // 200k DOA
  OWNER:        "0x6377cd174b35f3630b6d0db695f175d5f0dc5541", // 1,000,000 DOA
  BINANCE:      "0xb27df745fc43ca79f8250e52639594ae96315ef5"  // Binance wallet
};

async function checkBalance(address, tokenAddr, name) {
  if (!tokenAddr) {
    // MATIC nativo
    const balance = await provider.getBalance(address);
    const balanceFormatted = ethers.utils.formatEther(balance);
    console.log(`🔎 ${name} balance: ${balanceFormatted}`);
    return;
  }

  const token = new ethers.Contract(tokenAddr, erc20Abi, provider);
  const decimals = await token.decimals();
  const symbol = await token.symbol();
  const balance = await token.balanceOf(address);

  const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
  console.log(`🔎 ${symbol} balance: ${balanceFormatted}`);
}

async function main() {
  for (const [label, addr] of Object.entries(addresses)) {
    console.log(`👤 Checking balances for ${label}: ${addr}\n`);

    for (const [name, tokenAddr] of Object.entries(tokens)) {
      try {
        await checkBalance(addr, tokenAddr, name);
      } catch (err) {
        console.log(`❌ Error checking ${name}: ${err.message}`);
      }
      console.log("----");
    }
    console.log("\n============================\n");
  }
}

main().catch(console.error);
