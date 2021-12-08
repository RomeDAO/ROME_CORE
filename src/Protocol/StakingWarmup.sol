// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import './interfaces/IERC20.sol';

contract StakingWarmup {

    address public immutable staking;
    address public immutable sROME;

    constructor ( address _staking, address _sROME ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _sROME != address(0) );
        sROME = _sROME;
    }

    function retrieve( address _staker, uint _amount ) external {
        require( msg.sender == staking );
        IERC20( sROME ).transfer( _staker, _amount );
    }
}
