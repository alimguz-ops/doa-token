// scripts/checkTotalSupply.js
require("dotenv").config();
const { JsonRpcProvider, Contract, formatUnits } = require("ethers");

// RPC de Polygon
const provider = new JsonRpcProvider(
  process.env.POLYGON_RPC || "https://polygon-rpc.com"
);

// Dirección del contrato DOA (proxy)
const doaAddress =
  process.env.CONTRACT_ADDRESS ||
  "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo ERC20
const erc20Abi = [
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const doaToken = new Contract(doaAddress, erc20Abi, provider);

  const decimals = await doaToken.decimals();
  const supply = await doaToken.totalSupply();

  console.log("📊 Supply total actual de DOA V2:");
  console.log(`${formatUnits(supply, decimals)} DOA`);
}

main().catch((err) => {
  console.error("❌ Error al consultar supply total:", err);
  process.exitCode = 1;
});