// src/token.ts
import { ethers } from "ethers";

// Dirección del contrato DOA
const tokenAddress = "0x692d951163df3f7D9Fe071413F92c319D9B7369E"; // ← reemplazado con tu contrato real

// ABI mínimo ERC-20
const tokenABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

// Conexión RPC (puedes cambiar a Infura, Alchemy o tu nodo)
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

// Instancia del contrato (solo lectura)
export const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);