// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "../../lib/ds-test/test.sol";
import "./Hevm.sol";
import '../interfaces/IFactory.sol';
import '../interfaces/IRouter.sol';
import "../interfaces/IUniswapV2Pair.sol";
import "./GenericAccount.sol";
import "../mocks/mockToken.sol";
import {RomeBondingCalculator} from "../../src/Protocol/BondingCalculator.sol";
import {MIMBondDepository} from "../../src/Protocol/Bonds/MIMBondDepository.sol";
import {FRAXBondDepository} from "../../src/Protocol/Bonds/FRAXBondDepository.sol";
import {ROMEFRAXBondDepository} from "../../src/Protocol/Bonds/ROMEFRAXBondDepository.sol";
import {RedeemHelper} from "../../src/Protocol/RedeemHelper.sol";
import {RomeTreasury} from "../../src/Protocol/Treasury.sol";
import {Distributor} from "../../src/Protocol/Distributor.sol";
import {RomeStaking} from "../../src/Protocol/Staking.sol";
import {StakingWarmup} from "../../src/Protocol/StakingWarmup.sol";
import {StakingHelper} from "../../src/Protocol/StakingHelper.sol";
import {Rome} from "../../src/Protocol/RomeERC20.sol";
import {sRome} from "../../src/Protocol/sRomeERC20.sol";
import {aRome} from "../../src/Protocol/aRomeERC20.sol";
import {DaiRomePresale} from "../../src/Protocol/Presale/DaiPresale.sol";
import "../../src/Protocol/RomeAuthority.sol";


contract Dao {
    RomeTreasury public TREASURY;

    function init(RomeTreasury _TREASURY) public {
        TREASURY = _TREASURY;
    }

    function approve(address _token, address _who, uint _amount) public {
        IERC20( _token ).approve(_who, _amount);
    }

    function transfer(address _token, address _who, uint _amount) public {
        IERC20( _token ).transfer(_who, _amount);
    }

    function depositVault(uint _amount, address _token, uint _profit) public {
        TREASURY.deposit(_amount,_token,_profit);
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

    DaiRomePresale public PRESALE;

    IERC20 public DAI;

    constructor(DaiRomePresale _PRESALE, IERC20 _DAI) {
        PRESALE = _PRESALE;
        DAI = _DAI;
    }

    function approve(address _token, address _who, uint _amount) public {
        IERC20( _token ).approve(_who, _amount);
    }

    function deposit(uint _amount) public {
        DAI.approve(address(PRESALE), _amount);
        PRESALE.deposit(_amount);
    }

    function withdraw(uint _amount) public {
        PRESALE.withdraw(_amount);
    }

    function claimAlphaRome() public {
        PRESALE.claimAlphaRome();
    }
}

contract BondUser {

    ROMEFRAXBondDepository public ROMEFRAXBOND;

    IERC20 public FRAX;

    constructor(ROMEFRAXBondDepository _ROMEFRAXBOND, IERC20 _FRAX) {
        ROMEFRAXBOND = _ROMEFRAXBOND;
        FRAX = _FRAX;
    }

    function approve(address _token, address _who, uint _amount) public {
        IERC20( _token ).approve(_who, _amount);
    }

    function deposit(uint _amount, uint maxPrice, address depositor) public {
        FRAX.approve(address(ROMEFRAXBOND), _amount);
        ROMEFRAXBOND.deposit(_amount, maxPrice, depositor);
    }

    function redeem(address recipient, bool stake) public {
        ROMEFRAXBOND.redeem(recipient, stake);
    }
}

contract RomeTeam {

    DaiRomePresale public PRESALE;

    IERC20 public FRAX;

    constructor(DaiRomePresale _PRESALE, IERC20 _FRAX) {
        PRESALE = _PRESALE;
        FRAX = _FRAX;
    }

    function depositTeam(uint _amount) public {
        FRAX.approve(address(PRESALE), _amount);
        PRESALE.depositTeam(_amount);
    }
}

abstract contract RomeTest is DSTest {
    Hevm internal constant hevm =
        Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    Mock MIM;

    Mock FRAX;

    Mock DAI;

    IRouter solarRouter;

    IFactory solarFactory;

    Rome ROME;

    aRome aROME;

    sRome sROME;

    RomeAuthority AUTHORITY;

    Dao DAO;

    Warchest WARCHEST;

    Ops OPS;

    IUniswapV2Pair ROMEFRAX;

    function setUp() public virtual {
        // Moonriver deployments
        // WMOVR = IERC20(0x98878B06940aE243284CA214f92Bb71a2b032B8A);
        solarRouter = IRouter(0xAA30eF758139ae4a7f798112902Bf6d65612045f);
        solarFactory = IFactory(0x049581aEB6Fe262727f290165C29BDAB065a1B68);

        MIM = new Mock("Magic Internet Money", "MIM", 18);
        FRAX = new Mock("Frax", "FRAX", 18);
        DAI = new Mock("Dai", "DAI", 18);


        AUTHORITY = new RomeAuthority(address(this), address(this), address(this), address(this));

        ROME = new Rome(address( AUTHORITY ));

        aROME = new aRome();

        sROME = new sRome();

        DAO = new Dao();
        WARCHEST = new Warchest();
        OPS = new Ops();

        ROMEFRAX = IUniswapV2Pair(solarFactory.createPair( address( ROME ), address( FRAX ) ));

    }

    DaiRomePresale PRESALE;

    function PresaleDeploy() public virtual {
        PRESALE = new DaiRomePresale(
            address( aROME ),
            address( ROME ),
            address( DAI ),
            address( FRAX ),
            address( DAO ),
            address( WARCHEST )
        );
        aROME.setPresale(address( PRESALE ));
    }


    RomeTreasury TREASURY;
    RomeBondingCalculator CALCULATOR;

    function TreasuryDeploy() public virtual {
        CALCULATOR = new RomeBondingCalculator( address( ROME ) );

        TREASURY = new RomeTreasury(
            address( ROME ),
            address( DAI ),
            address( MIM ),
            address( FRAX ),
            address( ROMEFRAX ),
            address( CALCULATOR ),
            address( DAO ),
            6400 // 1 DAY timelock
        );
    }

    MIMBondDepository MIMBOND;
    FRAXBondDepository FRAXBOND;
    ROMEFRAXBondDepository ROMEFRAXBOND;
    RedeemHelper REDEEMHELPER;

    function BondsDeploy() public virtual {
        REDEEMHELPER = new RedeemHelper();

        MIMBOND = new MIMBondDepository(
            address( ROME ),
            address( MIM ),
            address( TREASURY ),
            address( WARCHEST ),
            address( CALCULATOR )
        );
        FRAXBOND = new FRAXBondDepository(
            address( ROME ),
            address( FRAX ),
            address( TREASURY ),
            address( WARCHEST ),
            address( CALCULATOR )
        );
        ROMEFRAXBOND = new ROMEFRAXBondDepository(
            address( ROME ),
            address( ROMEFRAX ),
            address( TREASURY ),
            address( WARCHEST ),
            address( CALCULATOR )
        );
    }

    RomeStaking STAKING;
    Distributor DISTRIBUTOR;
    StakingHelper STAKINGHELPER;
    StakingWarmup WARMUP;

    uint epochLength = 2200;
    uint firstEpochBlock = 2200;
    uint nextEpochBlock = 2200;
    uint firstEpochNumber = 1;
    function StakingDeploy() public virtual {
        STAKING = new RomeStaking(
            address( ROME ),
            address( sROME ),
            epochLength,
            firstEpochNumber,
            firstEpochBlock
        );
        DISTRIBUTOR = new Distributor(
            address( TREASURY ),
            address( ROME ),
            epochLength,
            nextEpochBlock
        );
        STAKINGHELPER = new StakingHelper( address( STAKING ), address( ROME ) );
        WARMUP = new StakingWarmup( address( STAKING ), address( sROME ) );
    }

    // function setMIMBalance(address account, uint256 amount) public {
    //     hevm.store(
    //         address( MIM ),
    //         keccak256(abi.encode(account, 2)),
    //         bytes32(amount)
    //     );
    // }

    // function setFRAXBalance(address account, uint256 amount) public {
    //     hevm.store(
    //         address( FRAX ),
    //         keccak256(abi.encode(account, 0)),
    //         bytes32(amount)
    //     );
    // }

    // function setDAIBalance(address account, uint256 amount) public {
    //     hevm.store(
    //         address( DAI ),
    //         keccak256(abi.encode(account, 2)),
    //         bytes32(amount)
    //     );
    // }
}
