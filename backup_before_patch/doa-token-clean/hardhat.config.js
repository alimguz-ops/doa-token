// hardhat.config.js
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    amoy: {
      url: process.env.AMOY_RPC || "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
      timeout: 120000,          // espera hasta 120s
      pollingInterval: 10000,   // chequea cada 10s
    },
    polygon: {
      url: process.env.POLYGON_RPC || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      timeout: 120000,          // espera hasta 120s
      pollingInterval: 10000,   // chequea cada 10s
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "", // ✅ usa la API key V2 de Etherscan
  },
  sourcify: {
    enabled: false, // oculta el warning de Sourcify
  },
};
