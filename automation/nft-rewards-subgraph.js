import { request, gql } from "graphql-request";
import { ethers } from "ethers";
import { readFileSync, writeFileSync, existsSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon";
const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Dirección oficial del AutoDistributor
const AUTODISTRIBUTOR_CONTRACT = "0x2EB7Fe8451Abeeaa9C05e0C5676282Abaf0a9419";

const distributorABI = [
  "function updateTradingVolume(address user, uint256 amount) external",
  "function claimTraderNFT() external",
  "event NFTClaimed(address indexed user, uint256 nftId, string category)"
];

const distributor = new ethers.Contract(AUTODISTRIBUTOR_CONTRACT, distributorABI, signer);

const MIN_LIQUIDITY_WEI = ethers.utils.parseUnits("300", 18);
const PAIR_SYMBOL_0 = "DOA";
const PAIR_SYMBOL_1 = "MATIC";

const query = gql`
  {
    positions(first: 50, orderBy: liquidity, orderDirection: desc) {
      id
      owner
      liquidity
      token0 { symbol }
      token1 { symbol }
      feeTier
      tickLower
      tickUpper
    }
  }
`;

async function main() {
  const data = await request(SUBGRAPH_URL, query);
  const elegibles = data.positions.filter(p =>
    ((p.token0.symbol === PAIR_SYMBOL_0 && p.token1.symbol === PAIR_SYMBOL_1) ||
     (p.token0.symbol === PAIR_SYMBOL_1 && p.token1.symbol === PAIR_SYMBOL_0))
  );

  const log = existsSync("logs/nft-distribution.json")
    ? JSON.parse(readFileSync("logs/nft-distribution.json", "utf-8"))
    : [];

  for (const pos of elegibles) {
    const liquidez = ethers.BigNumber.from(pos.liquidity);
    if (liquidez.gte(MIN_LIQUIDITY_WEI)) {
      // Actualizar volumen de trading en AutoDistributor
      const tx1 = await distributor.updateTradingVolume(pos.owner, liquidez);
      await tx1.wait();

      // Reclamar NFT Trader según volumen
      const tx2 = await distributor.connect(provider.getSigner(pos.owner)).claimTraderNFT();
      const receipt = await tx2.wait();
      const claimedEvent = receipt.events.find(e => e.event === "NFTClaimed");

      log.push({
        fecha: new Date().toISOString(),
        wallet: pos.owner,
        tipo: claimedEvent?.args?.category || "Trader Reward",
        nftId: claimedEvent?.args?.nftId?.toString() || "unknown",
        positionId: pos.id,
        par: `${pos.token0.symbol}/${pos.token1.symbol}`,
        feeTier: pos.feeTier,
        tickLower: pos.tickLower,
        tickUpper: pos.tickUpper,
        txHash: receipt.transactionHash
      });

      console.log(`NFT Trader emitido a ${pos.owner} | ID=${claimedEvent?.args?.nftId}`);
    }
  }

  writeFileSync("logs/nft-distribution.json", JSON.stringify(log, null, 2));
}

main().catch(console.error);
