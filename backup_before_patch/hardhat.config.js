require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
// require("@openzeppelin/hardhat-upgrades"); // <-- comentar si no está instalado
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-contract-sizer");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: false, runs: 200 },
          evmVersion: "paris",
          metadata: { bytecodeHash: "none" }
        }
      },
      {
        version: "0.8.22",
        settings: {
          optimizer: { enabled: false, runs: 200 },
          evmVersion: "paris",
          metadata: { bytecodeHash: "none" }
        }
      }
    ],
    overrides: {
      "contracts/NFT_DOA.sol": {
        version: "0.8.22",
        settings: {
          optimizer: { enabled: false, runs: 200 },
          evmVersion: "paris",
          metadata: { bytecodeHash: "ipfs" }
        }
      }
    }
  },
    
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },
    amoy: {
      url: process.env.AMOY_RPC || "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_ADMIN].filter(Boolean)
    },
    hardhat: { chainId: 1337 }
  },

  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY,
      amoy: process.env.POLYGONSCAN_API_KEY
    },
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
    token: "MATIC",
    coinmarketcap: process.env.CMC_API_KEY || null
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false
  }
};