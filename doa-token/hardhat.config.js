require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20", // ajusta a la versión de tu contrato DoaToken.sol
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC,       // RPC en tu archivo .env
      accounts: [process.env.PRIVATE_KEY],     // clave privada en tu archivo .env
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY, // API key en tu archivo .env
    },
  },
};
