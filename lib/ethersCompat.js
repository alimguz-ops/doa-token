const { ethers } = require("./provider");

// Detectar versión
const version = (ethers && ethers.version) ? ethers.version : "5.0.0";
const major = parseInt(version.split(".")[0], 10);

// formatUnits y parseUnits compatibles
let formatUnits, parseUnits;
if (major >= 6) {
  // ethers v6: funciones top-level o en ethers
  formatUnits = (value, decimals = 18) => ethers.formatUnits(value, decimals);
  parseUnits = (value, decimals = 18) => ethers.parseUnits(value, decimals);
} else {
  // ethers v5: utils.formatUnits / utils.parseUnits
  formatUnits = (value, decimals = 18) => ethers.utils.formatUnits(value, decimals);
  parseUnits = (value, decimals = 18) => ethers.utils.parseUnits(value, decimals);
}

module.exports = { formatUnits, parseUnits, ethers: ethers };
