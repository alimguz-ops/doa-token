require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

function requiredEnv(name) {
  if (!process.env[name]) throw new Error(`❌ Falta variable de entorno: ${name}`);
  return process.env[name];
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: requiredEnv("AMOY_RPC"),
      accounts: process.env.AMOY_PRIVATE_KEY ? [process.env.AMOY_PRIVATE_KEY] : []
    },
    polygon: {
      url: process.env.POLYGON_RPC || "https://polygon-rpc.com",
      accounts: [
        process.env.PRIVATE_KEY_ADMIN,
        process.env.PRIVATE_KEY_OWNER
      ].filter(Boolean),
      gasPrice: 50e9, // opcional: 50 gwei
      timeout: 60000  // opcional: 60 segundos
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || "",
    customChains: [
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      },
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com"
        }
      }
    ]
  }
};