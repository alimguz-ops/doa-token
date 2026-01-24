// scripts/checkTotalSupply.js
import hardhat from "hardhat";
import { formatUnits } from "ethers";   // Importar directamente la función en v6

const { ethers } = hardhat;

async function main() {
  const contractAddress = "0xf2513BF6187edc9EAf26d802bA1a1d9Cf6CA0448";

  const abi = [
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];

  const doaToken = await ethers.getContractAt(abi, contractAddress);

  const totalSupplyRaw = await doaToken.totalSupply();
  const decimals = await doaToken.decimals();

  // Usamos formatUnits directamente
  const totalSupplyHuman = formatUnits(totalSupplyRaw, decimals);

  console.log(`Total Supply de DOA: ${totalSupplyHuman} tokens`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
