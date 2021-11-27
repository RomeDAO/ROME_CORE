// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "./libraries/SafeERC20.sol";

import "./types/Policy.sol";
import "hardhat/console.sol";

interface IsROME {
    function rebase(uint256 romeProfit_, uint256 epoch_) external returns (uint256);

    function circulatingSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function gonsForBalance(uint256 amount) external view returns (uint256);

    function balanceForGons(uint256 gons) external view returns (uint256);

    function index() external view returns (uint256);
}

interface IWarmup {
    function retrieve(address staker_, uint256 amount_) external;
}

interface IDistributor {
    function distribute() external returns (bool);
}

contract RomeStaking is Policy {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public immutable ROME;
    address public immutable sROME;

    struct Epoch {
        uint256 length;
        uint256 number;
        uint256 endBlock;
        uint256 distribute;
    }
    Epoch public epoch;

    address public distributor;

    address public locker;
    uint256 public totalBonus;

    address public warmupContract;
    uint256 public warmupPeriod;

    constructor(
        address _ROME,
        address _sROME,
        uint256 _epochLength,
        uint256 _firstEpochNumber,
        uint256 _firstEpochBlock
    ) {
        require(_ROME != address(0));
        ROME = _ROME;
        require(_sROME != address(0));
        sROME = _sROME;

        epoch = Epoch({length: _epochLength, number: _firstEpochNumber, endBlock: _firstEpochBlock, distribute: 0});
    }

    struct Claim {
        uint256 deposit;
        uint256 gons;
        uint256 expiry;
        bool lock; // prevents malicious delays
    }
    mapping(address => Claim) public warmupInfo;

    /**
        @notice stake ROME to enter warmup
        @param _amount uint
        @return bool
     */
    function stake(uint256 _amount, address _recipient) external returns (bool) {
        console.log("balance before rebasing ==> %s", contractBalance());

        rebase();

        console.log("balance after rebasing ==> %s", contractBalance());

        IERC20(ROME).safeTransferFrom(msg.sender, address(this), _amount);

        Claim memory info = warmupInfo[_recipient];
        require(!info.lock, "Deposits for account are locked");

        warmupInfo[_recipient] = Claim({
            deposit: info.deposit.add(_amount),
            gons: info.gons.add(IsROME(sROME).gonsForBalance(_amount)),
            expiry: epoch.number.add(warmupPeriod),
            lock: false
        });

        IERC20(sROME).safeTransfer(warmupContract, _amount);
        return true;
    }

    /**
        @notice retrieve sROME from warmup
        @param _recipient address
     */
    function claim(address _recipient) public {
        Claim memory info = warmupInfo[_recipient];
        if (epoch.number >= info.expiry && info.expiry != 0) {
            delete warmupInfo[_recipient];
            IWarmup(warmupContract).retrieve(_recipient, IsROME(sROME).balanceForGons(info.gons));
        }
    }

    /**
        @notice forfeit sROME in warmup and retrieve ROME
     */
    function forfeit() external {
        Claim memory info = warmupInfo[msg.sender];
        delete warmupInfo[msg.sender];

        IWarmup(warmupContract).retrieve(address(this), IsROME(sROME).balanceForGons(info.gons));
        IERC20(ROME).safeTransfer(msg.sender, info.deposit);
    }

    /**
        @notice prevent new deposits to address (protection from malicious activity)
     */
    function toggleDepositLock() external {
        warmupInfo[msg.sender].lock = !warmupInfo[msg.sender].lock;
    }

    /**
        @notice redeem sROME for ROME
        @param _amount uint
        @param _trigger bool
     */
    function unstake(uint256 _amount, bool _trigger) external {
        console.log("entering unstaking");

        if (_trigger) {
            console.log("entering rebase trigger");
            rebase();
        }

        console.log("entering transfering sROME");
        IERC20(sROME).safeTransferFrom(msg.sender, address(this), _amount);

        console.log("entering transfering ROME");
        IERC20(ROME).safeTransfer(msg.sender, _amount);
    }

    /**
        @notice returns the sROME index, which tracks rebase growth
        @return uint
     */
    function index() public view returns (uint256) {
        return IsROME(sROME).index();
    }

    /**
        @notice trigger rebase if epoch over
     */
    function rebase() public {
        if (epoch.endBlock <= block.number) {
            console.log("check 1 Staking");
            IsROME(sROME).rebase(epoch.distribute, epoch.number);

            epoch.endBlock = epoch.endBlock.add(epoch.length);
            epoch.number++;

            if (distributor != address(0)) {
                IDistributor(distributor).distribute();
            }

            uint256 balance = contractBalance();
            uint256 staked = IsROME(sROME).circulatingSupply();

            console.log("balance => %s", balance);
            console.log("staked => %s", staked);

            if (balance <= staked) {
                epoch.distribute = 0;
            } else {
                epoch.distribute = balance.sub(staked);
            }
        }
    }

    /**
        @notice returns contract ROME holdings, including bonuses provided
        @return uint
     */
    function contractBalance() public view returns (uint256) {
        return IERC20(ROME).balanceOf(address(this)).add(totalBonus);
    }

    /**
        @notice provide bonus to locked staking contract
        @param _amount uint
     */
    function giveLockBonus(uint256 _amount) external {
        require(msg.sender == locker);
        totalBonus = totalBonus.add(_amount);
        IERC20(sROME).safeTransfer(locker, _amount);
    }

    /**
        @notice reclaim bonus from locked staking contract
        @param _amount uint
     */
    function returnLockBonus(uint256 _amount) external {
        require(msg.sender == locker);
        totalBonus = totalBonus.sub(_amount);
        IERC20(sROME).safeTransferFrom(locker, address(this), _amount);
    }

    enum CONTRACTS {
        DISTRIBUTOR,
        WARMUP,
        LOCKER
    }

    /**
        @notice sets the contract address for LP staking
        @param _contract address
     */
    function setContract(CONTRACTS _contract, address _address) external onlyPolicy {
        if (_contract == CONTRACTS.DISTRIBUTOR) {
            // 0
            distributor = _address;
        } else if (_contract == CONTRACTS.WARMUP) {
            // 1
            require(warmupContract == address(0), "Warmup cannot be set more than once");
            warmupContract = _address;
        } else if (_contract == CONTRACTS.LOCKER) {
            // 2
            require(locker == address(0), "Locker cannot be set more than once");
            locker = _address;
        }
    }

    /**
     * @notice set warmup period for new stakers
     * @param _warmupPeriod uint
     */
    function setWarmup(uint256 _warmupPeriod) external onlyPolicy {
        warmupPeriod = _warmupPeriod;
    }
}
