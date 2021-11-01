// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

interface IFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function getPair(address tokenA, address tokenB) external view returns (address pair);

    function createPair(address tokenA, address tokenB) external returns (address pair);
}
