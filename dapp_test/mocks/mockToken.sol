// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mock is ERC20 {
    using SafeERC20 for IERC20;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply);
    }

    function mint(address _who, uint256 _amount) public {
        _mint(_who,_amount);
    }
    function burn(address _who, uint256 _amount) public {
        _burn(_who,_amount);
    }
}
