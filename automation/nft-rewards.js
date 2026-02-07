import { ethers } from "ethers";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Dirección oficial del AutoDistributor
const AUTODISTRIBUTOR_CONTRACT = "0x2EB7Fe8451Abeeaa9C05e0C5676282Abaf0a9419";

const distributorABI = [
  "function claimMembership() external",
  "function claimFidelityReward() external",
  "function registerInfluencer() external",
  "function registerTrader() external",
  "function registerHolder() external",
  "event NFTClaimed(address indexed user, uint256 nftId, string category)",
  "event FidelityRewardClaimed(address indexed user, uint256 reward)"
];

const distributor = new ethers.Contract(AUTODISTRIBUTOR_CONTRACT, distributorABI, signer);

async function procesar() {
  const log = [];

  // Reclamar membresía por staking
  try {
    const tx = await distributor.claimMembership();
    const receipt = await tx.wait();
    const claimedEvent = receipt.events.find(e => e.event === "NFTClaimed");
    if (claimedEvent) {
      log.push({
        fecha: new Date().toISOString(),
        wallet: claimedEvent.args.user,
        tipo: claimedEvent.args.category,
        nftId: claimedEvent.args.nftId.toString(),
        txHash: receipt.transactionHash
      });
      console.log(`Membership NFT emitido a ${claimedEvent.args.user}`);
    }
  } catch (err) {
    console.error("Error en claimMembership:", err);
  }

  // Reclamar recompensa de fidelidad
  try {
    const tx = await distributor.claimFidelityReward();
    const receipt = await tx.wait();
    const fidelityEvent = receipt.events.find(e => e.event === "FidelityRewardClaimed");
    if (fidelityEvent) {
      log.push({
        fecha: new Date().toISOString(),
        wallet: fidelityEvent.args.user,
        reward: fidelityEvent.args.reward.toString(),
        txHash: receipt.transactionHash
      });
      console.log(`Recompensa de fidelidad emitida a ${fidelityEvent.args.user}`);
    }
  } catch (err) {
    console.error("Error en claimFidelityReward:", err);
  }

  writeFileSync("logs/autodistributor-actions.json", JSON.stringify(log, null, 2));
}

procesar().catch(console.error);
