// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./interfaces/IERC20.sol";

interface IStaking {
    function stake(uint256 _amount, address _recipient) external returns (bool);

    function claim(address _recipient) external;
}

contract StakingHelper {
    address public immutable staking;
    address public immutable ROME;

    constructor(address _staking, address _ROME) {
        require(_staking != address(0));
        staking = _staking;
        require(_ROME != address(0));
        ROME = _ROME;
    }

    function stake(uint256 _amount, address _recipient) external {
        IERC20(ROME).transferFrom(msg.sender, address(this), _amount);
        IERC20(ROME).approve(staking, _amount);
        IStaking(staking).stake(_amount, _recipient);
        IStaking(staking).claim(_recipient);
    }
}
