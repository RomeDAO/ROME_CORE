// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

abstract contract Hevm {
    // sets the block timestamp to x
    function warp(uint x) public virtual;

    // sets the block number to x
    function roll(uint x) public virtual;

    // sets the slot loc of contract c to val
    function store(address c, bytes32 loc, bytes32 val) public virtual;

    // reads the slot loc of contract c
    function load(address c, bytes32 loc) public virtual returns (bytes32 val);

    // Signs the digest using the private key sk.
    // Note that signatures produced via hevm.sign will leak the private key.
    function sign(uint sk, bytes32 digest) public virtual returns (address addr);

    // Derives an ethereum address from the private key sk
    function addr(uint sk) public virtual returns (address addr);

    // Executes the arguments as a command in the system shell and returns stdout
    function ffi(string[] calldata) external virtual returns (bytes memory);
}
