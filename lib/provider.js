require("dotenv").config();
const ethers = require("ethers");

const RPC = process.env.RPC_URL || "https://polygon-rpc.com";
const version = (ethers && ethers.version) ? ethers.version : "5.0.0";
const major = parseInt(version.split(".")[0], 10);

let provider;
if (major >= 6) {
  const { JsonRpcProvider } = ethers;
  provider = new JsonRpcProvider(RPC);
} else {
  provider = new ethers.providers.JsonRpcProvider(RPC);
}

module.exports = { provider, ethers };
