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
        string memory name = ROME.name();
        uint8 dec = ROME.decimals();
        string memory symbol = ROME.symbol();
        emit log(name);
        emit log_uint(uint(dec));
        emit log(symbol);
        fail();
    }
}
