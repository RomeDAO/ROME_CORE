// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
import "./utils/RomeSetup.sol";

contract Deployment is RomeTest {

    function setUp() public virtual override {
        super.setUp();

        PresaleDeploy();

        TreasuryDeploy();
    }

    function testDeploy() public {
        emit log_named_address('ROMEFRAX @', ROMEFRAX);
        fail();
    }
}
