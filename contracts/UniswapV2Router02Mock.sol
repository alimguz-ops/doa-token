// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UniswapV2Router02Mock {
    address public factory;
    address public WETH;

    event LiquidityAdded(address token, uint amountToken, uint amountETH, address to);
    event LiquidityRemoved(address token, uint liquidity, address to);

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH = _WETH;
    }

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity) {
        require(block.timestamp <= deadline, "Expired");
        // Mock: simplemente emite evento y devuelve valores
        emit LiquidityAdded(token, amountTokenDesired, msg.value, to);
        return (amountTokenDesired, msg.value, 1);
    }

    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH) {
        require(block.timestamp <= deadline, "Expired");
        // Mock: emite evento y devuelve valores dummy
        emit LiquidityRemoved(token, liquidity, to);
        return (amountTokenMin, amountETHMin);
    }
}
