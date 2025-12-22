// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UniswapV2Router02 {
    address public factory;
    address public WETH;

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH = _WETH;
    }

    // Aquí irían las funciones addLiquidityETH, removeLiquidityETH, etc.
}
