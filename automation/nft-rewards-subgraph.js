import { request, gql } from "graphql-request";
import { ethers } from "ethers";
import { readFileSync, writeFileSync, existsSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon";
const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const { address: NFT_DOA_CONTRACT } = JSON.parse(readFileSync("logs/nft_contract_address.json", "utf-8"));

const nftABI = [
  "function mint(address to, string memory tipo) public returns (uint256)",
  "event NFTMinted(address indexed to, uint256 tokenId, string tipo)"
];
const nftContract = new ethers.Contract(NFT_DOA_CONTRACT, nftABI, signer);

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
      const tx = await nftContract.mint(pos.owner, "LP Incentive DOA");
      const receipt = await tx.wait();
      const mintedEvent = receipt.events.find(e => e.event === "NFTMinted");
      const tokenId = mintedEvent?.args?.tokenId?.toString() || "unknown";

      log.push({
        fecha: new Date().toISOString(),
        wallet: pos.owner,
        tipo: "LP Incentive DOA",
        tokenId,
        positionId: pos.id,
        par: `${pos.token0.symbol}/${pos.token1.symbol}`,
        feeTier: pos.feeTier,
        tickLower: pos.tickLower,
        tickUpper: pos.tickUpper,
        txHash: receipt.transactionHash
      });

      console.log(`Minted NFT to ${pos.owner} | tokenId=${tokenId} | positionId=${pos.id}`);
    }
  }

  writeFileSync("logs/nft-distribution.json", JSON.stringify(log, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});