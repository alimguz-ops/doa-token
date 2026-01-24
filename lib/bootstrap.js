const path = require("path");
const { provider, ethers } = require(path.join(process.cwd(), "lib", "provider"));
const { formatUnits, parseUnits } = require(path.join(process.cwd(), "lib", "ethersCompat"));

global.provider = provider;
global.ethers = ethers;
global.formatUnits = formatUnits;
global.parseUnits = parseUnits;
