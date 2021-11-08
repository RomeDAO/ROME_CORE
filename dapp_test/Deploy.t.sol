// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
import "./utils/RomeSetup.sol";

contract Deployment is RomeTest {

    function setUp() public virtual override {
        super.setUp();

        PresaleDeploy();

        TreasuryDeploy();

        BondsDeploy();

        StakingDeploy();
    }

    function testPresale() public {
    }
}
