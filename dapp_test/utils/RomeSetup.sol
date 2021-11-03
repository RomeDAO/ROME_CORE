// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "./test.sol";
import "./Hevm.sol";
import '../Interfaces/IFactory.sol';
import '../Interfaces/IRouter.sol';
import '../Interfaces/IERC20.sol';
import "./GenericAccount.sol";
import {RomeBondingCalculator} from "../../src/BondingCalculator.sol";
import {ROMEMOVRBondDepository} from "../../src/Bonds/ROMEMOVRBondDepository.sol";
import {MOVRBondDepository} from "../../src/Bonds/MOVRBondDepository.sol";
import {MIMBondDepository} from "../../src/Bonds/MIMBondDepository.sol";
import {FRAXBondDepository} from "../../src/Bonds/FRAXBondDepository.sol";
import {ROMEMIMBondDepository} from "../../src/Bonds/ROMEMIMBondDepository.sol";
import {ROMEFRAXBondDepository} from "../../src/Bonds/ROMEFRAXBondDepository.sol";
import {RedeemHelper} from "../../src/RedeemHelper.sol";
import {RomeTreasury} from "../../src/Treasury.sol";
import {Distributor} from "../../src/Distributor.sol";
import {RomeStaking} from "../../src/Staking.sol";
import {StakingWarmup} from "../../src/StakingWarmup.sol";
import {StakingHelper} from "../../src/StakingHelper.sol";
import {Rome} from "../../src/RomeERC20.sol";
import {sRome} from "../../src/sRomeERC20.sol";
import {aRome} from "../../src/aRomeERC20.sol";
import {DaiRomePresale} from "../../src/Presale/DaiPresale.sol";
import {ClaimHelper} from "../../src/Presale/ClaimHelper.sol";


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

    Rome ROME;

    sRome SROME;

    RomeBondingCalculator internal bondingCalculator;

    uint256 numberUsers = 5;

    RomeUser[] internal user;

    function setUp() public virtual {
        WMOVR = IERC20(0x98878B06940aE243284CA214f92Bb71a2b032B8A);
        MIM = IERC20(0x0caE51e1032e8461f4806e26332c030E34De3aDb);
        FRAX = IERC20(0x1A93B23281CC1CDE4C4741353F3064709A16197d);

        for (uint i = 0; i < numberUsers; i++) {
            user.push( new RomeUser() );
        }

        log("test");

    }
}
