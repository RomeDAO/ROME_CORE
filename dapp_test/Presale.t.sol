// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
import "./utils/RomeSetup.sol";
import "../src/Protocol/libraries/SafeMath.sol";

// contract Whitelist is RomeTest {

//     uint256 numberUsers = 5;

//     RomeUser[] internal user;

//     RomeTeam[] internal team;

//     address[] internal arr;

//     function setUp() public virtual override {
//         super.setUp();

//         PresaleDeploy();
//         for (uint i = 0; i < numberUsers; i++) {
//             user.push( new RomeUser(PRESALE,DAI) );
//             team.push( new RomeTeam(PRESALE,FRAX) );
//         }
//     }
//     function testWhitelistRevert() public {
//         PRESALE.start();
//         try
//             PRESALE.addWhitelist(address(0))
//         {fail();} catch Error(string memory error) {
//             assertEq(error,"Sale has already started");
//         }
//     }

//     function testWhitelist() public {
//         for ( uint i = 0; i < numberUsers; i++) {
//             address addr = address(user[i]);
//             assertTrue(!PRESALE.whitelisted(addr));
//             assertTrue(!PRESALE.whitelistedTeam(addr));
//             PRESALE.addWhitelist(addr);
//             PRESALE.addTeam(addr,3);
//             assertTrue(PRESALE.whitelisted(addr));
//             assertTrue(PRESALE.whitelistedTeam(addr));
//             (uint num,,,) = PRESALE.teamInfo(addr);
//             assertEq(num,3);
//         }
//         for ( uint i = 0; i < numberUsers; i++) {
//             address addr = address(user[i]);
//             PRESALE.removeWhitelist(addr);
//             PRESALE.removeTeam(addr);
//             assertTrue(!PRESALE.whitelisted(addr));
//             assertTrue(!PRESALE.whitelistedTeam(addr));
//             (uint num,,,) = PRESALE.teamInfo(addr);
//             assertEq(num,0);
//         }
//     }

//     function testMultipleWhitelist() public {
//         for ( uint i = 0; i < numberUsers; i++) {
//             address addr = address(user[i]);
//             arr.push(addr);
//         }
//         PRESALE.addMultipleWhitelist(arr);

//         for ( uint i = 0; i < numberUsers; i++) {
//             address addr = address(user[i]);
//             assertTrue(PRESALE.whitelisted(addr));
//         }
//     }
// }

// contract Logic is RomeTest {
//     using SafeMath for uint;

//     uint256 numberUsers = 5;

//     RomeUser[] internal user;

//     RomeTeam[] internal team;

//     function setUp() public virtual override {
//         super.setUp();

//         PresaleDeploy();
//         for (uint i = 0; i < numberUsers; i++) {
//             user.push( new RomeUser(PRESALE,DAI) );
//             team.push( new RomeTeam(PRESALE,FRAX) );
//         }
//         for ( uint i = 0; i < numberUsers; i++) {
//             address addr = address(user[i]);
//             address addrTeam = address(team[i]);
//             PRESALE.addWhitelist(addr);
//             PRESALE.addTeam(addrTeam,3);
//             DAI.mint(addr, 1e36);
//             FRAX.mint(addrTeam, 1e36);
//         }
//     }

//     function testCannotDepositBeforeStart() external {
//         try
//             user[0].deposit(100*1e18)
//         {fail();} catch Error(string memory error) {
//             emit log(error);
//             assertEq(error,'Sale has not started');
//         }
//     }

//     function testCannotDepositAfterEnd() external {
//         PRESALE.start();
//         PRESALE.end();
//         try
//             user[0].deposit(100*1e18)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'Sale has ended');
//         }
//     }

//     function testCannotDepositIfNotWhitelisted() external {
//         PRESALE.removeWhitelist(address(user[0]));
//         PRESALE.start();
//         try
//             user[0].deposit(100*1e18)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'msg.sender is not whitelisted user');
//         }
//     }

//     function testCannotDepositTeamIfNotWhitelisted() external {
//         PRESALE.removeTeam(address(team[0]));
//         PRESALE.start();
//         try
//             team[0].depositTeam(100*1e18)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'msg.sender is not whitelisted team');
//         }
//     }

//     function testCannotDepositOverCap() external {
//         PRESALE.start();
//         user[0].deposit(1500*1e18);
//         try
//             user[0].deposit(1)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'new amount above user limit');
//         }
//     }

//     function testCannotDepositTeamOverCap() external {
//         PRESALE.start();
//         team[0].depositTeam(3*1500*1e18);
//         try
//             team[0].depositTeam(1)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'new amount above team limit');
//         }
//     }

//     function testDeposits(uint _amount) external {
//         PRESALE.start();
//         address addr;
//         uint amount;
//         uint counterDai;
//         uint counterFrax;
//         uint counterDebt;
//         for (uint i = 0; i < numberUsers; i++) {
//             addr = address(user[i]);
//             amount = _amount % PRESALE.cap();
//             user[i].deposit(amount);
//             counterDai = counterDai.add(amount);
//             counterDebt = counterDebt.add(amount.mul(1e18).div(PRESALE.price()).div(1e9));
//             assertEq(aROME.balanceOf(addr),amount.mul(1e18).div(PRESALE.price()).div(1e9));
//             (uint userAmount,,) = PRESALE.userInfo(addr);
//             assertEq(userAmount,amount);
//             assertEq(amount.mul(1e18).div(PRESALE.price()).div(1e9),aROME.balanceOf(addr));
//         }

//         counterDebt = 0;

//         for (uint i = 0; i < numberUsers; i++) {
//             addr = address(team[i]);
//             amount = 3 * _amount % PRESALE.cap();
//             team[i].depositTeam(amount);
//             counterFrax = counterFrax.add(amount);
//             counterDebt = counterDebt.add(amount.mul(1e18).div(PRESALE.price()).div(1e9));
//             (,uint teamAmount,,) = PRESALE.teamInfo(addr);
//             assertEq(teamAmount,amount);
//             assertEq(aROME.balanceOf(address(WARCHEST)),counterDebt);
//         }
//         assertEq(DAI.balanceOf(address( DAO )),counterDai);
//         assertEq(PRESALE.totalRaisedDAI(),counterDai);
//         assertEq(FRAX.balanceOf(address( DAO )),counterFrax);
//         assertEq(PRESALE.totalRaisedFRAX(),counterFrax);
//         assertEq(PRESALE.totalDebt(),aROME.totalSupply());
//     }

//     function testCannotWithdrawBeforeClaimable() external {
//         PRESALE.start();
//         PRESALE.end();
//         aROME.approve(address( PRESALE ), 100*1e18);
//         try
//             user[0].withdraw(100*1e18)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'ROME is not yet claimable');
//         }
//     }

//     function testCannotClaimUnlockWithoutSufficientROME() external {
//         PRESALE.start();
//         user[0].deposit(100*1e18);
//         PRESALE.end();
//         try
//             PRESALE.claimUnlock()
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'not enough ROME in contract');
//         }
//     }

//     function testCanClaimUnlock(uint amount) external {
//         if ( amount >= 1e36 || amount <= 1e18 ) return;

//         TreasuryDeploy();
//         AUTHORITY.pushVault(address(TREASURY), true);
//         DAO.init( TREASURY );

//         PRESALE.start();
//         amount = amount % (PRESALE.cap());
//         user[0].deposit(amount);
//         PRESALE.end();

//         DAO.approve(address( DAI ), address( TREASURY ), amount);
//         DAO.depositVault(amount,address( DAI ),0);

//         assertEq(ROME.balanceOf( address( DAO ) ), amount.div(1e9));

//         DAO.transfer(address( ROME ),address( PRESALE ), ROME.balanceOf(address( DAO )));

//         PRESALE.claimUnlock();
//         assertTrue(PRESALE.claimable());
//     }

//     function testWithdraw(uint amount) external {
//         if ( amount >= 1e36 || amount <= 1e18 ) return;

//         TreasuryDeploy();
//         AUTHORITY.pushVault(address(TREASURY), true);
//         DAO.init( TREASURY );

//         PRESALE.start();

//         for ( uint i = 0; i < numberUsers; i++) {
//             amount = amount % (PRESALE.cap());
//             user[i].deposit(amount);
//         }
//         PRESALE.end();

//         DAO.approve(address( DAI ), address( TREASURY ), PRESALE.totalRaisedDAI());
//         DAO.depositVault(PRESALE.totalRaisedDAI(),address( DAI ),0);
//         DAO.transfer(address( ROME ),address( PRESALE ), PRESALE.totalDebt());

//         PRESALE.claimUnlock();

//         for ( uint i = 0; i < numberUsers; i++) {
//             uint bal = aROME.balanceOf(address(user[i]));
//             user[i].approve(address( aROME ), address( PRESALE ), bal);
//             user[i].withdraw(bal);
//             assertEq(ROME.balanceOf(address(user[i])), bal);
//         }
//         assertEq(ROME.balanceOf(address(PRESALE)), 0);
//     }

//     function testAdminWithdraw(uint amount) external {
//         if ( amount >= 1e36 || amount <= 1e18 ) return;
//         FRAX.mint(address( PRESALE ), amount);
//         PRESALE.adminWithdraw(address( FRAX ), amount);
//         assertEq(FRAX.balanceOf(address( this )), amount);
//     }

//     function testCannotAdminWithdrawWithoutAccess() external {
//         PRESALE.transferOwnership(address(1));
//         try
//             PRESALE.adminWithdraw(address(1),1*1e18)
//         {fail();} catch Error(string memory error) {
//             assertEq(error,'Ownable: caller is not the owner');
//         }
//     }

//     function testClaimAlphaRome(uint amount) external {
//         if ( amount >= 1e36 || amount <= 1e18 ) return;

//         TreasuryDeploy();
//         AUTHORITY.pushVault(address(TREASURY), true);
//         DAO.init( TREASURY );

//         PRESALE.start();

//         for ( uint i = 0; i < numberUsers; i++) {
//             amount = amount % (PRESALE.cap());
//             user[i].deposit(amount);
//         }
//         PRESALE.end();

//         DAO.approve(address( DAI ), address( TREASURY ), PRESALE.totalRaisedDAI());
//         DAO.depositVault(PRESALE.totalRaisedDAI(),address( DAI ),0);
//         DAO.transfer(address( ROME ),address( PRESALE ), PRESALE.totalDebt());

//         PRESALE.claimUnlock();

//         for ( uint i = 0; i < numberUsers; i++) {
//             uint bal = aROME.balanceOf(address(user[i]));
//             user[i].approve(address( aROME ), address( PRESALE ), bal);
//             user[i].withdraw(bal);
//         }

//         PRESALE.claimAlphaUnlock();

//         for ( uint i = 0; i < numberUsers; i++) {
//             user[i].claimAlphaRome();
//         }

//         assertEq(aROME.balanceOf(address(PRESALE)), 0);
//     }

//     function testGetUserRemainingAllocation() external {
//         uint256 amtToDeposit = 100 * 1e18;
//         PRESALE.start();
//         user[0].deposit(amtToDeposit);
//         uint256 remaining = PRESALE.getUserRemainingAllocation(address(user[0]));
//         assertEq(remaining, PRESALE.cap().sub(amtToDeposit));
//     }

//     function testContractPause() external {
//         TreasuryDeploy();
//         AUTHORITY.pushVault(address(TREASURY), true);
//         DAO.init( TREASURY );
//         PRESALE.start();
//         uint amount = PRESALE.cap();

//         // DEPOSIT
//         PRESALE.togglePause(); // pause contract
//         try
//             user[0].deposit(amount)
//         {fail();} catch Error(string memory error) {
//             emit log(error);
//             assertEq(error,'contract is paused');
//         }
//         PRESALE.togglePause();  // unpause contract
//         user[0].deposit(amount);

//         // assert successful deposit after unpausing contract
//         assertEq(DAI.balanceOf(address( DAO ) ), amount);

//         PRESALE.end();

//         DAO.approve(address( DAI ), address( TREASURY ), PRESALE.totalRaisedDAI());
//         DAO.depositVault(PRESALE.totalRaisedDAI(),address( DAI ),0);
//         DAO.transfer(address( ROME ),address( PRESALE ), PRESALE.totalDebt());
//         PRESALE.claimUnlock();

//         uint bal = aROME.balanceOf(address( user[0] ));
//         user[0].approve(address( aROME ), address( PRESALE ), bal);


//         // WITHDRAWAL
//         PRESALE.togglePause(); // pause contract
//         try
//             user[0].withdraw(bal)
//         {fail();} catch Error(string memory error) {
//             emit log(error);
//             assertEq(error,'contract is paused');
//         }
//         PRESALE.togglePause();
//         user[0].withdraw(bal);


//         // assert ROME transfered to user address after contract unpaused
//         assertEq(ROME.balanceOf(address( user[0] )), bal);
//         assertEq(ROME.balanceOf(address( PRESALE )), 0);

//         // assert aRome transfered to PRESALE contract after contract unpaused
//         assertEq(aROME.balanceOf(address( PRESALE )), bal);
//         assertEq(aROME.balanceOf(address( user[0] )), 0);
//     }
// }
