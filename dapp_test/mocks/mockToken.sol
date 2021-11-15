// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import "../../src/libraries/SafeERC20.sol";
import "../../src/types/ERC20.sol";


contract Mock is ERC20 {
    using SafeERC20 for IERC20;

    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol, decimals) {
    }

    function mint(address _who, uint256 _amount) public {
        _mint(_who,_amount);
    }
    function burn(address _who, uint256 _amount) public {
        _burn(_who,_amount);
    }
}
