require("dotenv").config();
const { ethers } = require("ethers");

// Mensaje exacto de Etherscan
const mensaje = "[Etherscan.io 22/01/2026 18:44:07] I, hereby verify that I am the owner/creator of the address [0x6F52809EfdDF5826956EeF9C289A661624afb0cE]";

// Cargar la clave privada desde .env
const privateKey = process.env.PRIVATE_KEY_OWNER;
const wallet = new ethers.Wallet(privateKey);

async function main() {
  console.log("Usando dirección:", wallet.address);
  const firma = await wallet.signMessage(mensaje);
  console.log("Signature Hash:", firma);
}

main();
