import { ethers } from "ethers";
import fs from "fs";

const configPath = new URL("../config/polygon-mainnet.json", import.meta.url);
const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const investors = JSON.parse(fs.readFileSync(new URL("../data/investors.json", import.meta.url), "utf-8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(cfg.POLYGON_RPC);

  const pairAbi = [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
  ];
  const erc20Abi = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)"
  ];

  console.log("\n🔎 Monitorización completa de DOA en Polygon mainnet\n");

  // --- Pools ---
  const pools = {
    WMATIC: cfg.PAIR_ADDRESS_WMATIC,
    USDC: cfg.PAIR_ADDRESS_USDC,
    DAI: cfg.PAIR_ADDRESS_DAI,
    USDT: cfg.PAIR_ADDRESS_USDT
  };

  for (const [symbol, pairAddress] of Object.entries(pools)) {
    if (!pairAddress || pairAddress === "") {
      console.log(`⚠️ Pool DOA/${symbol} aún no creado.`);
      continue;
    }

    const pair = new ethers.Contract(pairAddress, pairAbi, provider);
    const [t0, t1] = await Promise.all([pair.token0(), pair.token1()]);
    const { reserve0, reserve1 } = await pair.getReserves();

    const token0 = new ethers.Contract(t0, erc20Abi, provider);
    const token1 = new ethers.Contract(t1, erc20Abi, provider);

    const [sym0, sym1, dec0, dec1] = await Promise.all([
      token0.symbol(),
      token1.symbol(),
      token0.decimals(),
      token1.decimals()
    ]);

    const r0 = Number(ethers.formatUnits(reserve0, dec0));
    const r1 = Number(ethers.formatUnits(reserve1, dec1));

    console.log(`✅ Pool DOA/${symbol} (${pairAddress})`);
    console.log(`   - ${sym0}: ${r0}`);
    console.log(`   - ${sym1}: ${r1}\n`);
  }

  // --- Balances ---
  const doa = new ethers.Contract(cfg.TOKEN_ADDRESS, erc20Abi, provider);
  const dec = await doa.decimals();
  const sym = await doa.symbol();

  console.log("💰 Balances de DOA en wallets clave:\n");

  // Deployer
  const balDeployer = await doa.balanceOf(walletAddress(cfg.POLYGON_PRIVATE_KEY));
  console.log(`- Deployer: ${ethers.formatUnits(balDeployer, dec)} ${sym}`);

  // Multisig
  const balMultisig = await doa.balanceOf(cfg.MULTISIG_SAFE);
  console.log(`- Multisig: ${ethers.formatUnits(balMultisig, dec)} ${sym}`);

  // Inversores
  for (const { address } of investors) {
    const balInv = await doa.balanceOf(address);
    console.log(`- Inversor ${address}: ${ethers.formatUnits(balInv, dec)} ${sym}`);
  }

  console.log("\n🚀 Monitorización completa terminada.\n");
}

// Helper para obtener dirección desde private key
function walletAddress(pk) {
  return new ethers.Wallet(pk).address;
}

main().catch((err) => {
  console.error("Error en checkAllBalances.js:", err);
  process.exitCode = 1;
});
