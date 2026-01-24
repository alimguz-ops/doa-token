const { config: dotenvConfig } = require("dotenv");
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

dotenvConfig();

module.exports = {
  solidity: {
    version: "0.8.29",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "paris",
      metadata: { bytecodeHash: "none" }
    }
  },

  networks: {
    hardhat: { chainId: 1337 },

    mainnet: {
      url: process.env.ETH_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },

    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER].filter(Boolean)
    },

    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },

    amoy: {
      url: process.env.AMOY_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN, process.env.AMOY_PRIVATE_KEY].filter(Boolean)
    }
  },

  // ✅ Migración a Etherscan API V2 con una sola clave
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
    customChains: [
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com"
        }
      },
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    token: "ETH",
    coinmarketcap: process.env.CMC_API_KEY || null,
    showTimeSpent: true,
    showMethodSig: true
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false
  },

  mocha: { timeout: 40000 }
};
