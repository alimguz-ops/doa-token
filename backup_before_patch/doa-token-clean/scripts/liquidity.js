const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("💧 Adding liquidity with account:", deployer.address);

  const doaAddress = process.env.CONTRACT_ADDRESS;
  const doa = await ethers.getContractAt(process.env.CONTRACT_NAME, doaAddress);

  const router = await ethers.getContractAt(
    "IUniswapV2Router02",
    process.env.ROUTER_ADDRESS
  );

  // Aprobar tokens al router
  const tokenAmount = ethers.parseUnits(process.env.LIQ_TOKEN_AMOUNT, process.env.TOKEN_DECIMALS);
  await doa.approve(process.env.ROUTER_ADDRESS, tokenAmount);

  const deadline = Math.floor(Date.now() / 1000) + parseInt(process.env.DEADLINE_SECONDS);

  if (process.env.BASE_IS_NATIVE === "true") {
    // Liquidez con MATIC nativo
    const baseAmount = ethers.parseEther(process.env.LIQ_BASE_AMOUNT);
    await router.addLiquidityETH(
      doaAddress,
      tokenAmount,
      0,
      0,
      deployer.address,
      deadline,
      { value: baseAmount }
    );
    console.log("✅ Liquidity added with MATIC");
  } else {
    // Liquidez con ERC20 base
    const baseToken = await ethers.getContractAt("IERC20", process.env.BASE_TOKEN_ADDRESS);
    const baseAmount = ethers.parseUnits(process.env.LIQ_BASE_AMOUNT, 18);
    await baseToken.approve(process.env.ROUTER_ADDRESS, baseAmount);

    await router.addLiquidity(
      doaAddress,
      process.env.BASE_TOKEN_ADDRESS,
      tokenAmount,
      baseAmount,
      0,
      0,
      deployer.address,
      deadline
    );
    console.log("✅ Liquidity added with ERC20 base token");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
