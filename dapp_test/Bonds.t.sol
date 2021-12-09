// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
import "./utils/RomeSetup.sol";


// set up bonds

// deploy liquidity at x price
// test bond with x amount out put variables
// console.log out
// watch for large discount drops

// contract Bonds is RomeTest {

//     uint256 numberUsers = 5;
//     BondUser[] internal user;

//     using SafeMath for uint;


//     function setUp() public virtual override {
//         super.setUp();
//         TreasuryDeploy();
//         BondsDeploy();
//         StakingDeploy();

//         AUTHORITY.pushVault(address(TREASURY), true);
//         TREASURY.queue(RomeTreasury.MANAGING(0), address(this));
//         TREASURY.queue(RomeTreasury.MANAGING(4), address(ROMEFRAXBOND));

//         hevm.roll(block.number + 6400);

//         TREASURY.toggle(RomeTreasury.MANAGING(0), address(this), address(0));
//         TREASURY.toggle(RomeTreasury.MANAGING(4), address(ROMEFRAXBOND), address(0));
//         uint256 initialSupplyFrax = 750000*1e18;
//         uint256 initialSupplyRome = 750*1e9;


//         FRAX.mint(address(this), 10000000000*1e18);  // 10 million frax
//         FRAX.approve(address(TREASURY), type(uint256).max);
//         TREASURY.deposit(171150*1e18, address(FRAX), 0);
//         TREASURY.deposit(2000000*1e18, address(FRAX), 2000000*1e9);  // reserves

//         //IUniswapV2Pair pair = IUniswapV2Pair(solarFactory.createPair(address(FRAX), address(ROME)));

//         emit log_named_address("pair === ", ROMEFRAX.token0());

//         FRAX.approve(address(solarRouter), type(uint256).max);
//         ROME.approve(address(solarRouter), type(uint256).max);

//         solarRouter.addLiquidity(
//             address( FRAX ),
//             address( ROME ),
//             initialSupplyFrax,
//             initialSupplyRome,
//             initialSupplyFrax,
//             initialSupplyRome,
//             address(this),
//             block.timestamp
//         );

//         for (uint i = 0; i < numberUsers; i++) {
//             user.push( new BondUser(ROMEFRAXBOND,FRAX) );
//             user[i].approve(ROMEFRAXBOND.principle(), address(ROMEFRAXBOND), type(uint256).max);
//         }
//     }

//     function testBaseCase() public {
//         uint256 bcv = 60;
//         uint256 vestingTerm = 33100;
//         uint256 minPrice = 2220;
//         uint256 maxPayout = 1000;
//         uint256 fee = 1000;
//         uint256 maxDebt = 50000000000000000000000;
//         uint256 initialDebt = 0;

//         emit log_named_uint("romefrax total supply === ", ROMEFRAX.totalSupply());

//         ROMEFRAXBOND.setStaking(address(STAKING), false);
//         ROMEFRAXBOND.initializeBondTerms(
//             bcv,
//             vestingTerm,
//             minPrice,
//             maxPayout,
//             fee,
//             maxDebt,
//             initialDebt
//         );

//         for (uint i = 0; i < numberUsers; i++) {
//             emit log_named_uint("bond price ", ROMEFRAXBOND.bondPrice());
//             emit log_named_uint("bond price in USD", ROMEFRAXBOND.bondPriceInUSD().div(1e18));
//             emit log_named_address("bond calculator === ",TREASURY.bondCalculator(address(ROMEFRAX)));

//             uint deposit = 75*1e15;
//             ROMEFRAX.transfer(address(user[i]), deposit);
//             user[i].deposit(deposit, 200000*1e11, address(user[i]));
//             emit log("==============================");
//         }
//     }
// }
