// scripts/mint_nft_doa.js
import hre from "hardhat";
import { readFileSync } from "fs";

async function main() {
  const { ethers } = hre;

  // Dirección del contrato desplegado en Polygon mainnet
  // Si prefieres leerlo desde logs, mantén la línea de readFileSync
  // const log = JSON.parse(readFileSync("logs/nft_contract_address.json", "utf8"));
  // const nftAddress = log.address;
  const nftAddress = "0x93f8256de602703Af0b7Ecc3f0C2Dd4cbAe57B65"; // ✅ tu contrato NFT_DOA

  // Conectar con el contrato NFT_DOA
  const NFT = await ethers.getContractFactory("NFT_DOA");
  const nft = NFT.attach(nftAddress);

  // Obtener el deployer (o minter)
  const [deployer] = await ethers.getSigners();

  // Dirección destino y metadatos del NFT
  const to = deployer.address; // puedes cambiar a otra wallet
  const tokenURI = "ipfs://bafkreiac6ygqj2ln4eismkptcvojntjz54lauuzijfh3fixlaub6u34y4u"; 
  // ✅ tu metadata.json ya subido a Lighthouse/IPFS

  // Ejecutar mint
  const tx = await nft.connect(deployer).mintNFT(to, tokenURI);
  await tx.wait();

  console.log(`✅ NFT acuñado para: ${to}`);
  console.log(`🔗 TokenURI: ${tokenURI}`);
}

main().catch((e) => {
  console.error("❌ Error en mint_nft_doa.js:", e);
  process.exit(1);
});