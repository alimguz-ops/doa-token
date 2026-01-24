import { ethers } from "ethers";
import { ADDRESSES } from "../ADDRESSES.js";
import { writeFileSync } from "fs";

// Configuración RPC
const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

// Dirección del contrato NFT_DOA desplegado
const NFT_DOA_CONTRACT = "0xNFT_CONTRACT_ADDRESS"; // reemplazar con la real

// ABI mínima para interactuar con NFT_DOA
const nftABI = [
  "function mint(address to, string memory tipo) public returns (uint256)",
  "event NFTMinted(address indexed to, uint256 tokenId, string tipo)"
];

// Inicializar contrato
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nftContract = new ethers.Contract(NFT_DOA_CONTRACT, nftABI, signer);

// Simulación de eventos externos (staking y gobernanza)
const stakingEvents = [
  { wallet: "0x123...", amount: 500 }, // ejemplo: wallet con 500 DOA en stake
  { wallet: "0x456...", amount: 200 }
];

const governanceVotes = [
  { wallet: "0x789...", proposalId: 1 },
  { wallet: "0xabc...", proposalId: 2 }
];

async function procesar() {
  const log = [];

  // Incentivos por staking
  for (const stake of stakingEvents) {
    if (stake.amount >= 300) { // umbral mínimo
      const tx = await nftContract.mint(stake.wallet, "Stake Reward");
      const receipt = await tx.wait();
      const tokenId = receipt.events[0].args.tokenId.toString();

      log.push({
        fecha: new Date().toISOString(),
        wallet: stake.wallet,
        tipo: "Stake Reward",
        tokenId
      });
    }
  }

  // Incentivos por gobernanza
  for (const vote of governanceVotes) {
    const tx = await nftContract.mint(vote.wallet, "Governance Reward");
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    log.push({
      fecha: new Date().toISOString(),
      wallet: vote.wallet,
      tipo: "Governance Reward",
      tokenId,
      proposalId: vote.proposalId
    });
  }

  // Guardar log
  writeFileSync("logs/nft-distribution.json", JSON.stringify(log, null, 2));
}

procesar().catch(console.error);