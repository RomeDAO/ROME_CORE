// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "../../lib/ds-test/test.sol";
import "./utils/Hevm.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/AggregatorV3Interface.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IRouter.sol";
import "../src/Protocol/libraries/SafeMath.sol";
import {ROMEMOVRBondDepository} from "../src/Protocol/Bonds/ROMEMOVRBondDepository.sol";
import {RomeTreasury} from "../../src/Protocol/Treasury.sol";
import {RomeBondingCalculator} from "../src/Protocol/BondingCalculator.sol";

contract BondUser {
    using SafeMath for uint;

    ROMEMOVRBondDepository public BOND;

    constructor(ROMEMOVRBondDepository BOND_) {
        BOND = BOND_;
    }

    function approve(address _token, address _who, uint _amount) public {
        IERC20( _token ).approve(_who, _amount);
    }

    function deposit(uint _amount, uint maxPrice, address depositor) public returns(uint) {
        uint val = BOND.deposit(_amount, maxPrice, depositor);
        return val;
    }

    function redeem(address recipient, bool stake) public {
        BOND.redeem(recipient, stake);
    }
    function addLiquidity(address router,address tokenA, address tokenB) public {
        uint amountA = IERC20(tokenA).balanceOf(address(this));
        uint amountB = IERC20(tokenB).balanceOf(address(this));
        IERC20(tokenA).approve(router,amountA);
        IERC20(tokenB).approve(router,amountB);
        IRouter(router).addLiquidity(
            tokenA,
            tokenB,
            amountA,
            amountB,
            amountA.div(2),
            amountB.div(2),
            address(this),
            block.timestamp
        );
    }
}

contract RomeMovrBondTest is DSTest {
    using SafeMath for uint;
    
    Hevm internal constant hevm =
        Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    IERC20 internal WMOVR =
        IERC20(0x98878B06940aE243284CA214f92Bb71a2b032B8A);

    IERC20 internal ROME =
        IERC20(0x4a436073552044D5f2f49B176853ad3Ad473d9d6);

    IUniswapV2Pair internal ROMEMOVR =
        IUniswapV2Pair(0x0ceE045861051f8f5FD4e62622F87556c8e555B6);

    IRouter internal ROUTER = 
        IRouter(0xAA30eF758139ae4a7f798112902Bf6d65612045f);

    AggregatorV3Interface internal FEED =
        AggregatorV3Interface(0x3f8BFbDc1e79777511c00Ad8591cef888C2113C1);

    ROMEMOVRBondDepository internal BOND;

    RomeTreasury internal TREASURY;

    RomeBondingCalculator internal CALCULATOR;

    uint movrPrice;

    uint numberUsers = 5;

    BondUser[] internal user;

    function setUp() public virtual {
        //1. Deploy Treasury
        TREASURY = new RomeTreasury(
            address( ROME ),
            address(1),
            address(1),
            address(1),
            address(1),
            address(1),
            address(this),
            0
        );
        // Set Vault for authority
        setVault(0x59FceceC609dAB272C7302afC5F8f90bac9d771D,address( TREASURY ));
        // Mint reserves
        forceReserves(address( TREASURY ), 1000000*1e18);

        movrPrice = uint(FEED.latestAnswer());
        emit log("======================");
        emit log("ROMEMOVR BONDS");
        emit log("======================");

        CALCULATOR = new RomeBondingCalculator(address( ROME ));

        //2. Deploy Bonds
        BOND = new ROMEMOVRBondDepository(
            address( ROME ),
            address( ROMEMOVR ),
            address( TREASURY ),
            address(this),
            address( CALCULATOR ),
            address( FEED )
        );

        TREASURY.queue(RomeTreasury.MANAGING(8), address(BOND));
        TREASURY.toggle(RomeTreasury.MANAGING(8), address(BOND), address(0));

        TREASURY.queue(RomeTreasury.MANAGING(5), address(ROMEMOVR));
        TREASURY.toggle(RomeTreasury.MANAGING(5), address(ROMEMOVR),address(CALCULATOR));

        for (uint i = 0; i < numberUsers; i++) {
            user.push( new BondUser(BOND) );
            user[i].approve(BOND.principle(), address(BOND), type(uint256).max);
        }

    }

    function testDeployment() public {
        //1. set terms
        uint bcv = 370;
        emit log_named_uint("<|BCV|> == ", bcv);
        uint minPrice = 9900;
        emit log_named_uint("<|Min Price|> ==", minPrice);
        uint maxPayout = 50;
        emit log_named_uint("<|Max Payout|> ==", maxPayout);

        BOND.initializeBondTerms(
            bcv,
            32000,
            minPrice,
            maxPayout,
            5000000000000000,
            0
        );   

        //2. Prints Rome Price
        // Reserve0 is Rome (9 dec), Reserve1 is Movr (18 dec).
        // movPrice (8 dec)
        // decimals: 18 + 8 - 9 = 17 decimals
        
        (uint reserve0, uint reserve1,) = ROMEMOVR.getReserves();
        uint romePrice = reserve1.mul(movrPrice).div(reserve0);
        emit log_named_uint("<MOVR Price USD> ==", movrPrice.div(1e8));
        emit log_named_uint("<|Rome Price USD|> ==", romePrice.div(1e17));

        for (uint i = 0; i < numberUsers; i++) {
            //3. Print BondPrice in USD
            emit log_named_uint("bond price ", BOND.bondPrice());
            emit log_named_uint("bond price in USD", BOND.bondPriceInUSD().div(1e18));
            address addr = address(user[i]);

            //4. mint Rome and Movr
            setBalance(addr,50*1e18,address(WMOVR),3);
            setBalance(addr,25*1e9,address(ROME),0);     

            //5. add liquidity
            uint balBefore = ROME.balanceOf(addr);
            user[i].addLiquidity(address(ROUTER),address(ROME),address(WMOVR));
            emit log_named_uint("LP added in ROME", 2*(balBefore.sub(ROME.balanceOf(addr))).div(1e9));

            //6. purchase bonds
            uint payout = user[i].deposit(ROMEMOVR.balanceOf(addr), 200000*1e11, addr);

            //7. Print Payout in USD
            emit log_named_uint("Payout in ROME ==",payout.div(1e9));

            emit log("==============================");


        }
    }

    function setBalance(address account, uint256 amount, address token, uint256 slot) public {
        hevm.store(
            token,
            keccak256(abi.encode(account, slot)),
            bytes32(amount)
        );
    }

    function setVault(address tar, address vault) public {
        hevm.store(
            tar,
            bytes32(uint(5)),
            bytes32(uint256(uint160(vault)))
        );
    }

    function forceReserves(address tar, uint256 amount) public {
        hevm.store(
            tar,
            bytes32(uint(33)),
            bytes32(uint(amount))
        );
    }
}
