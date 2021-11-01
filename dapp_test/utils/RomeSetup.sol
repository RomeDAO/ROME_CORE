// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "./test.sol";
import "./Hevm.sol";
import "../Interfaces/IERC20.sol";
import '../Interfaces/IFactory.sol';
import '../Interfaces/IRouter.sol';
import "./GenericAccount.sol";
import "../../src/BondingCalculator.sol";
import "../../src/Bonds/RomeBondDepository.sol";
import "../../src/RedeemHelper.sol";
import "../../src/Treasury.sol";
import "../../src/Distributor.sol";
import "../../src/Staking.sol";
import "../../src/StakingHelper.sol";
import "../../src/Treasury.sol";
import "../../src/RomeERC20.sol";
import "../../src/sRomeERC20.sol";

contract RomeUser is GenericAccount {

    constructor() {
    }

}

abstract contract RomeTest is DSTest {
    Hevm internal constant hevm =
        Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    IERC20 WMOVR;

    IERC20 MIM;

    IERC20 FRAX;

    BondingCalculator internal bondingCalculator;

    RomeUser[] internal user;

    function setUp() public virtual {
        WMOVR = IERC20('0x98878b06940ae243284ca214f92bb71a2b032b8a');
        MIM = IERC20('0x0cae51e1032e8461f4806e26332c030e34de3adb');
        FRAX = IERC20('0x1A93B23281CC1CDE4C4741353F3064709A16197d');

        for (uint i = 0; i < numUsers; i++) {
            user.push( new RomeUser() );
        }

    }
}
