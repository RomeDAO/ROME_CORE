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

contract Dao {
    constructor() {
    }
}

contract Warchest {
    constructor() {
    }
}

contract Ops {
    constructor() {
    }
}

contract RomeUser {
    constructor() {
    }
}

contract RomeTeam {
    constructor() {
    }
}

abstract contract RomeTest is DSTest {
    Hevm internal constant hevm =
        Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    IERC20 WMOVR;

    IERC20 MIM;

    IERC20 FRAX;

    IERC20 DAI;

    IRouter solarRouter;

    IFactory solarFactory;

    Rome ROME;

    aRome aROME;

    sRome sROME;

    Dao DAO;

    Warchest WARCHEST;

    Ops OPS;

    uint256 numberUsers = 5;

    RomeUser[] internal user;

    RomeTeam[] internal team;

    function setUp() public virtual {
        // Moonriver deployments
        // WMOVR = IERC20(0x98878B06940aE243284CA214f92Bb71a2b032B8A);
        MIM = IERC20(0x0caE51e1032e8461f4806e26332c030E34De3aDb);
        FRAX = IERC20(0x1A93B23281CC1CDE4C4741353F3064709A16197d);
        DAI = IERC20(0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844);
        solarRouter = IRouter(0xAA30eF758139ae4a7f798112902Bf6d65612045f);
        solarFactory = IFactory(0x049581aEB6Fe262727f290165C29BDAB065a1B68);

        ROME = new Rome();

        aROME = new aRome();

        sROME = new sRome();

        for (uint i = 0; i < numberUsers; i++) {
            user.push( new RomeUser() );
            team.push( new RomeTeam() );
        }
        DAO = new Dao();
        WARCHEST = new Warchest();
        OPS = new Ops();
    }

    ClaimHelper CLAIMHELPER;
    DaiRomePresale PRESALE;

    function PresaleDeploy() public virtual {
        CLAIMHELPER = new ClaimHelper( address( ROME ), address( DAO ) );
        PRESALE = new DaiRomePresale(
            address( aROME ),
            address( ROME ),
            address( DAI ),
            address( FRAX ),
            address( DAO ),
            address( WARCHEST ),
            address( CLAIMHELPER )
        );
    }


    RomeTreasury TREASURY;
    RomeBondingCalculator CALCULATOR;
    address ROMEFRAX;
    function TreasuryDeploy() public virtual {
        CALCULATOR = new RomeBondingCalculator( address( ROME ) );

        ROMEFRAX = solarFactory.createPair( address( ROME ), address( FRAX ) );

        TREASURY = new RomeTreasury(
            address( ROME ),
            address( DAI ),
            address( MIM ),
            address( FRAX ),
            ROMEFRAX,
            address( CALCULATOR ),
            6400 // 1 DAY timelock
        );
    }
}
