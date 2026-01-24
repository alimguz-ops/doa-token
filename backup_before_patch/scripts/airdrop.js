// scripts/airdrop.js (ESM + ethers v6)
import dotenv from "dotenv";
import hre from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = hre;
dotenv.config();

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const decimals = parseInt(process.env.DECIMALS || "18", 10);
  const chainId = parseInt(process.env.CHAIN_ID || "137", 10);

  if (!tokenAddress) throw new Error("TOKEN_ADDRESS no definido en .env");

  // Cargar destinatarios
  const listPath = path.join(process.cwd(), "addresses.json");
  if (!fs.existsSync(listPath)) throw new Error("addresses.json no encontrado en la raíz del proyecto");
  const recipients = JSON.parse(fs.readFileSync(listPath, "utf8"));
  if (!Array.isArray(recipients) || recipients.length === 0) throw new Error("addresses.json vacío o inválido");

  // ABI mínima ERC20
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
    "function symbol() public view returns (string)",
    "function name() public view returns (string)",
    "function decimals() public view returns (uint8)"
  ];

  const [signer] = await ethers.getSigners();
  const token = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const network = await ethers.provider.getNetwork();

  if (Number(network.chainId) !== chainId) {
    throw new Error(`Red incorrecta: esperado chainId=${chainId}, actual=${Number(network.chainId)}`);
  }

  const sender = await signer.getAddress();
  const symbol = await token.symbol().catch(() => "DOA");
  const name = await token.name().catch(() => "DoaToken");
  const tokenDecimals = await token.decimals().catch(() => decimals);

  console.log(`\n== DOA Airdrop ==`);
  console.log(`Contrato: ${tokenAddress}`);
  console.log(`Token: ${name} (${symbol}), Decimals: ${tokenDecimals}`);
  console.log(`Emisor: ${sender}`);
  console.log(`Red: ${network.name} (chainId ${network.chainId})\n`);

  // Preparar logs
  const logsDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonLogPath = path.join(logsDir, `airdrop-${ts}.json`);
  const csvLogPath = path.join(logsDir, `airdrop-${ts}.csv`);
  const summary = {
    tokenAddress,
    symbol,
    network: network.name,
    chainId: Number(network.chainId),
    sender,
    startedAt: new Date().toISOString(),
    transfers: []
  };
  fs.writeFileSync(csvLogPath, "address,amount,txHash,status,blockNumber\n");

  // Ejecutar transferencias
  for (const { address, amount } of recipients) {
    if (!ethers.isAddress(address)) {
      console.warn(`Saltando dirección inválida: ${address}`);
      summary.transfers.push({ address, amount, status: "invalid_address" });
      fs.appendFileSync(csvLogPath, `${address},${amount},,invalid_address,\n`);
      continue;
    }
    const value = ethers.parseUnits(String(amount), tokenDecimals);
    console.log(`→ Enviando ${amount} ${symbol} a ${address} ...`);
    try {
      const tx = await token.transfer(address, value);
      console.log(`   txHash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`   confirmado en bloque ${receipt.blockNumber}\n`);
      summary.transfers.push({
        address,
        amount,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        status: "confirmed"
      });
      fs.appendFileSync(csvLogPath, `${address},${amount},${tx.hash},confirmed,${receipt.blockNumber}\n`);
    } catch (err) {
      console.error(`   error: ${err.message}\n`);
      summary.transfers.push({ address, amount, error: err.message, status: "failed" });
      fs.appendFileSync(csvLogPath, `${address},${amount},,failed,\n`);
    }
  }

  summary.finishedAt = new Date().toISOString();
  fs.writeFileSync(jsonLogPath, JSON.stringify(summary, null, 2));
  console.log(`\nLogs guardados:\n- ${jsonLogPath}\n- ${csvLogPath}`);
  console.log("Airdrop completado.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});