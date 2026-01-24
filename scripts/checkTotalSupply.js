// scripts/checkTotalSupply.js
import { config as dotenvConfig } from "dotenv";
import { ethers } from "ethers";

dotenvConfig();

// RPC de Polygon (o el que definas en .env)
const provider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC_URL || "https://polygon-rpc.com"
);

// Dirección del contrato DOA (proxy)
const doaAddress =
  process.env.CONTRACT_ADDRESS ||
  "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo ERC20 extendido
const erc20Abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, provider);

  const name = await doaToken.name();
  const symbol = await doaToken.symbol();
  const decimals = await doaToken.decimals();
  const supply = await doaToken.totalSupply();

  console.log("📊 Información del token DOA V2:");
  console.log(`Nombre: ${name}`);
  console.log(`Símbolo: ${symbol}`);
  console.log(`Decimales: ${decimals}`);
  console.log(`Total Supply: ${ethers.utils.formatUnits(supply, decimals)} ${symbol}`);

  // Verificar balances de direcciones clave si están en .env
  const addressesToCheck = [
    { label: "Owner", addr: process.env.OWNER_ADDRESS },
    { label: "Admin", addr: process.env.ADMIN_ADDRESS },
    { label: "Comunidad", addr: process.env.COMMUNITY_ADDRESS },
    { label: "Reserva", addr: process.env.RESERVE_ADDRESS }
  ];

  for (const { label, addr } of addressesToCheck) {
    if (addr && ethers.utils.isAddress(addr)) {
      const balance = await doaToken.balanceOf(addr);
      console.log(
        `👤 Balance ${label}: ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`
      );
    }
  }
}

main().catch((err) => {
  console.error("❌ Error al consultar supply/balances:", err);
  process.exitCode = 1;
});
