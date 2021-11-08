// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
import "./utils/RomeSetup.sol";
import '../src/Libraries/utils/SafeMath.sol';

contract Whitelist is RomeTest {

    function setUp() public virtual override {
        super.setUp();

        PresaleDeploy();
        for (uint i = 0; i < numberUsers; i++) {
            user.push( new RomeUser(PRESALE,DAI) );
            team.push( new RomeTeam() );
        }
    }
    function testWhitelistRevert() public {
        PRESALE.start();
        try
            PRESALE.addWhitelist(address(0))
        {fail();} catch Error(string memory error) {
            assertEq(error,"Sale has already started");
        }
    }

    function testWhitelist() public {
        for ( uint i = 0; i < numberUsers; i++) {
            address addr = address(user[i]);
            assertTrue(!PRESALE.whitelisted(addr));
            assertTrue(!PRESALE.whitelistedTeam(addr));
            PRESALE.addWhitelist(addr);
            PRESALE.addTeam(addr,3);
            assertTrue(PRESALE.whitelisted(addr));
            assertTrue(PRESALE.whitelistedTeam(addr));
            (uint num,,,,) = PRESALE.teamInfo(addr);
            assertEq(num,3);
        }
        for ( uint i = 0; i < numberUsers; i++) {
            address addr = address(user[i]);
            PRESALE.removeWhitelist(addr);
            PRESALE.removeTeam(addr);
            assertTrue(!PRESALE.whitelisted(addr));
            assertTrue(!PRESALE.whitelistedTeam(addr));
            (uint num,,,,) = PRESALE.teamInfo(addr);
            assertEq(num,0);
        }
        address[] storage arr;
        for ( uint i = 0; i < numberUsers; i++) {
            address addr = address(user[i]);
            arr.push(addr);
        }
        PRESALE.addMultipleWhitelist(arr);
        for ( uint i = 0; i < numberUsers; i++) {
            address addr = address(user[i]);
            assertTrue(PRESALE.whitelisted(addr));
        }

    }
}

contract Deposit is RomeTest {
    using SafeMath for uint;

    function setUp() public virtual override {
        super.setUp();

        PresaleDeploy();
        for (uint i = 0; i < numberUsers; i++) {
            user.push( new RomeUser(PRESALE,DAI) );
            team.push( new RomeTeam() );
        }
        for ( uint i = 0; i < numberUsers; i++) {
            address addr = address(user[i]);
            PRESALE.addWhitelist(addr);
            PRESALE.addTeam(addr,3);
            setDAIBalance(addr, type(uint256).max);
        }
    }

    function testCannotDepositBeforeStart() external {
        try
            user[0].deposit(100*1e18)
        {fail();} catch Error(string memory error) {
            emit log(error);
            assertEq(error,'Sale has not started');
        }
    }
    function testCannotDepositAfterEnd() external {
        PRESALE.start();
        PRESALE.end();
        try
            user[0].deposit(100*1e18)
        {fail();} catch Error(string memory error) {
            assertEq(error,'Sale has ended');
        }
    }
    function testCannotDepositIfNotWhitelisted() external {
        PRESALE.removeWhitelist(address(user[0]));
        PRESALE.start();
        try
            user[0].deposit(100*1e18)
        {fail();} catch Error(string memory error) {
            assertEq(error,'msg.sender is not whitelisted');
        }
    }
    function testCannotDepositOverCap() external {
        PRESALE.start();
        user[0].deposit(1500*1e18);
        try
            user[0].deposit(1)
        {fail();} catch Error(string memory error) {
            assertEq(error,'new amount above user limit');
        }
    }
    function testDeposit() external {
        PRESALE.start();
        address addr = address(user[0]);
        uint amount = 1000*1e18;
        user[0].deposit(amount);
        emit log_address(address(DAO));
        emit log_address(PRESALE.DAO());
        assertEq(DAI.balanceOf(address( DAO )),amount);
        assertEq(aROME.balanceOf(addr),amount.div(1e9));
        //user.amount
        //total raised
        //user.payout
        //totalDebt

    }
}
