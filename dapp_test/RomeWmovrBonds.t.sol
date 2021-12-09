// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "../../lib/ds-test/test.sol";
import "./utils/Hevm.sol";
import './interfaces/IERC20.sol';
import './interfaces/AggregatorV3Interface.sol';
import "./interfaces/IUniswapV2Pair.sol";
import {ROMEMOVRBondDepository} from "../src/Protocol/Bonds/ROMEMOVRBondDepository.sol";
import {RomeTreasury} from "../../src/Protocol/Treasury.sol";
import {RomeBondingCalculator} from "../src/Protocol/BondingCalculator.sol";

contract BondUser {

    ROMEMOVRBondDepository public BOND;

    constructor(ROMEMOVRBondDepository BOND_) {
        BOND = BOND_;
    }

    function approve(address _token, address _who, uint _amount) public {
        IERC20( _token ).approve(_who, _amount);
    }

    function deposit(uint _amount, uint maxPrice, address depositor) public {
        BOND.deposit(_amount, maxPrice, depositor);
    }

    function redeem(address recipient, bool stake) public {
        BOND.redeem(recipient, stake);
    }
}

contract RomeMovrBondTest is DSTest {
    Hevm internal constant hevm =
        Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    IERC20 internal WMOVR =
        IERC20(0x98878B06940aE243284CA214f92Bb71a2b032B8A);

    IERC20 internal ROME =
        IERC20(0x4a436073552044D5f2f49B176853ad3Ad473d9d6);

    IUniswapV2Pair internal ROMEMOVR =
        IUniswapV2Pair(0x0ceE045861051f8f5FD4e62622F87556c8e555B6);

    AggregatorV3Interface internal FEED =
        AggregatorV3Interface(0x3f8BFbDc1e79777511c00Ad8591cef888C2113C1);

    ROMEMOVRBondDepository internal BOND;

    RomeTreasury internal TREASURY;

    RomeBondingCalculator internal CALCULATOR;

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

        //3. add pair balance
        setPairBalance(address(this),1*1e18);
        emit log_named_uint("Pair Balance ==", ROMEMOVR.balanceOf(address(this))/1e18);

        for (uint i = 0; i < numberUsers; i++) {
            user.push( new BondUser(BOND) );
            user[i].approve(BOND.principle(), address(BOND), type(uint256).max);
        }

    }

    function testDeployment() public {
        uint bcv = 370;
        emit log_named_uint("||BCV|| == ", bcv);
        uint minPrice = 2000;
        emit log_named_uint("||Min Price|| ==", minPrice);

        uint deposit = 1 * 1e16; // 0.01

        //1. set Terms
        BOND.initializeBondTerms(
            bcv,
            32000,
            minPrice,
            100,
            5000000000000000,
            0
        );

        //2. Print BondPrice in USD
        emit log_named_uint("bond price ", BOND.bondPrice());
        emit log_named_uint("BondPrice @ Start", BOND.bondPriceInUSD()/1e18);

    }

    function setPairBalance(address account, uint256 amount) public {
        hevm.store(
            address( ROMEMOVR ),
            keccak256(abi.encode(account, 1)),
            bytes32(amount)
        );
    }
}
