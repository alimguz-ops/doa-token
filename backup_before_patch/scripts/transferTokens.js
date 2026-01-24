// scripts/transferTokens.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Configuración del provider
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-rpc.com");

// Wallet que ejecuta la transferencia (Admin o Owner según tu caso)
const senderWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

// Dirección del contrato DOA (proxy)
const doaAddress = process.env.CONTRACT_ADDRESS || "0x692d951163df3f7D9Fe071413F92c319D9B7369E";

// ABI mínimo ERC20
const erc20Abi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

async function main() {
  const doaToken = new ethers.Contract(doaAddress, erc20Abi, senderWallet);

  // Parámetros dinámicos: destino y cantidad
  const to = process.env.TRANSFER_TO;       // Dirección destino
  const amountStr = process.env.TRANSFER_AMOUNT; // Cantidad en DOA

  if (!to || !amountStr) {
    throw new Error("❌ Debes definir TRANSFER_TO y TRANSFER_AMOUNT en tu .env");
  }
  if (!ethers.isAddress(doaAddress) || !ethers.isAddress(to)) {
    throw new Error("❌ Dirección inválida en .env");
  }

  const decimals = await doaToken.decimals();
  const amount = ethers.parseUnits(amountStr, decimals);

  console.log(`🚀 Transfiriendo ${amountStr} DOA desde ${senderWallet.address} hacia ${to}...`);
  const tx = await doaToken.transfer(to, amount);
  console.log("📄 Hash de transacción:", tx.hash);

  const receipt = await tx.wait();
  console.log(`🎉 Transferencia completada en bloque ${receipt.blockNumber}, gas usado: ${receipt.gasUsed}`);
}

main().catch((err) => {
  console.error("❌ Error en transferencia:", err.message);
  process.exitCode = 1;
});