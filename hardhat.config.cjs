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

    // Ethereum mainnet
    mainnet: {
      url: process.env.ETH_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },

    // Alias para usar --network ethereum
    ethereum: {
      url: process.env.ETH_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },

    // Ethereum testnet
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY_OWNER].filter(Boolean)
    },

    // Polygon mainnet
    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },

    // Polygon Amoy testnet
    amoy: {
      url: process.env.AMOY_RPC,
      accounts: [
        process.env.PRIVATE_KEY_OWNER,
        process.env.PRIVATE_KEY_ADMIN,
        process.env.AMOY_PRIVATE_KEY
      ].filter(Boolean)
    }
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY,
    customChains: [
      {
        network: "ethereum",
        chainId: 1,
        urls: {
          apiURL: "https://api.etherscan.io/api",
          browserURL: "https://etherscan.io"
        }
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io"
        }
      },
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
