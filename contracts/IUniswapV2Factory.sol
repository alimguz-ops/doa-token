// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UniswapV2Factory {
    address public feeTo;
    address public feeToSetter;
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
        require(getPair[tokenA][tokenB] == address(0), "PAIR_EXISTS");
        // Aquí normalmente se desplegaría UniswapV2Pair, para simplificar puedes usar un mock
        pair = address(uint160(allPairs.length + 1)); // mock address
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair;
        allPairs.push(pair);
        emit PairCreated(tokenA, tokenB, pair, allPairs.length);
    }
}
