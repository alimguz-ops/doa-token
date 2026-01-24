const { ethers } = require("hardhat");

// Direcciones de QuickSwap en Amoy (ejemplo, ajusta segÃºn tu despliegue)
const ROUTER_ADDRESS = "0xa5E..."; // Router de QuickSwap Amoy
const TOKEN_ADDRESS = "0x...";     // DirecciÃ³n de tu token desplegado
const WETH_ADDRESS = "0x...";      // DirecciÃ³n de WMATIC en Amoy

async function main() {
  const [signer] = await ethers.getSigners();
  const router = await ethers.getContractAt("IUniswapV2Router02", ROUTER_ADDRESS, signer);

  console.log("\nðŸ”Ž Probando swaps en QuickSwap Amoy...\n");

  // --- 1. Comprar Token con MATIC ---
  const amountIn = ethers.utils.parseEther("0.1"); // 0.1 MATIC
  const pathBuy = [WETH_ADDRESS, TOKEN_ADDRESS];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  try {
    const txBuy = await router.swapExactETHForTokens(
      0, // mÃ­nimo de tokens aceptados
      pathBuy,
      signer.address,
      deadline,
      { value: amountIn }
    );
    await txBuy.wait();
    console.log("âœ… Compra realizada con 0.1 MATIC â†’ Token");
  } catch (e) {
    console.log("âŒ Error al comprar:", e.message);
  }

  // --- 2. Vender Token por MATIC ---
  const token = await ethers.getContractAt("IERC20", TOKEN_ADDRESS, signer);
  const balance = await token.balanceOf(signer.address);

  if (balance.gt(0)) {
    try {
      // Aprobar router para gastar tokens
      await token.approve(ROUTER_ADDRESS, balance);

      const pathSell = [TOKEN_ADDRESS, WETH_ADDRESS];
      const txSell = await router.swapExactTokensForETH(
        balance,
        0, // mÃ­nimo de MATIC aceptado
        pathSell,
        signer.address,
        deadline
      );
      await txSell.wait();
      console.log("âœ… Venta realizada Token â†’ MATIC");
    } catch (e) {
      console.log("âŒ Error al vender:", e.message);
    }
  } else {
    console.log("âš ï¸ No tienes tokens para vender.");
  }

  console.log("\nðŸ“Š Prueba de swaps completa.\n");
}

main();

