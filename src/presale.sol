// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import './Libraries/Ownable.sol';
import './Libraries/SafeERC20.sol';

contract RomePresale is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct UserInfo {
        uint256 amount; // Amount DAI deposited by user
        uint256 payout;
        bool claimed; // True if user has claimed his sROME
    }

    // Tokens to raise (DAI) and for offer (sROME)
    IERC20 public DAI;
    IERC20 public sROME;

    address public DAO; // Multisig treasury to send proceeds to

    uint256 public price = 3 * 1e18; // 3 DAI per ROME

    uint256 public cap = 2000 * 1e18; // 2000 DAI cap per whitelisted user

    uint256 public totalRaised; // total DAI raised by sale

    uint256 public totalDebt; // total sROME owed to users

    bool public started; // true when sale is started

    bool public ended; // true when sale is ended

    bool public claimable; // true when sale is claimable

    address public claimHelper; // address of claimingHelper contract

    mapping(address => UserInfo) public userInfo;

    mapping(address => bool) public whitelisted; // True if user is whitelisted

    mapping(address => uint256) public romeClaimable; // amount of rome claimable by address

    event Deposit(address indexed who, uint amount);
    event Withdraw(address indexed who, uint amount);
    event SaleStarted(uint block);
    event SaleEnded(uint block);
    event ClaimUnlocked(uint block);
    event AdminWithdrawal(address token, uint amount, address indexed admin);

    constructor(
        address _sROME,
        address _DAI,
        address _DAO,
        address _claimHelper
    ) {
        require( _sROME != address(0) );
        sROME = IERC20(_sROME);
        require( _DAI != address(0) );
        DAI = IERC20(_DAI);
        require( _DAO != address(0) );
        DAO = _DAO;
        require( _DAO != address(0) );
        claimHelper = _claimHelper;
    }

    /**
     *  @notice adds a single whitelist to the sale
     *  @param _address: address to whitelist
     */
    function addWhitelist(address _address) external onlyOwner {
        whitelisted[_address] = true;
    }

    /**
     *  @notice adds multiple whitelist to the sale
     *  @param _addresses: dynamic array of addresses to whitelist
     */
    function addMultipleWhitelist(address[] calldata _addresses) external onlyOwner {
        for (uint i = 0; i < _addresses.length; i++) {
            whitelisted[_addresses[i]] = true;
        }
    }

    /**
     *  @notice removes a single whitelist from the sale
     *  @param _address: address to remove from whitelist
     */
    function removeWhitelist(address _address) external onlyOwner {
        whitelisted[_address] = false;
    }

    // @notice It sets claim helper address
    function setClaimHelper(address _claimHelper) external onlyOwner {
        claimHelper = _claimHelper;
    }

    // @notice Starts the sale
    function start() external onlyOwner {
        require(!started, "Sale has already started");
        started = true;
        emit SaleStarted(block.number);
    }

    // @notice Ends the sale
    function end() external onlyOwner {
        require(started, "Sale has not started");
        require(!ended, "Sale has already ended");
        ended = true;
        emit SaleEnded(block.number);
    }

    // @notice lets users claim sROME
    // @dev send sufficient sROME before calling
    function claimUnlock() external onlyOwner {
        require(ended, "Sale has not ended");
        require(!claimable, "Claim has already been unlocked");
        require(sROME.balanceOf(address(this)) >= totalDebt, 'not enough sROME in contract');
        claimable = true;
        emit ClaimUnlocked(block.number);
    }

    // @notice lets users claim sROME
    // @dev send sufficient sROME before calling
    function claimUnlockWithHelper() external {
        require(msg.sender == claimHelper, "msg.sender is not claimHelper");
        require(ended, "Sale has not ended");
        require(!claimable, "Claim has already been unlocked");
        require(sROME.balanceOf(address(this)) >= totalDebt, 'not enough sROME in contract');
        claimable = true;
        emit ClaimUnlocked(block.number);
    }


    /**
     *  @notice transfer ERC20 token to DAO multisig
     *  @param _token: token address to withdraw
     *  @param _amount: amount of token to withdraw
     */
    function AdminWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20( _token ).safeTransfer( DAO, _amount );
        emit AdminWithdrawal(_token, _amount, DAO);
    }

    /**
     *  @notice it deposits DAI for the sale
     *  @param _amount: amount of DAI to deposit to sale (18 decimals)
     */
    function deposit(uint256 _amount) external {
        require(started, 'Sale has not started');
        require(!ended, 'Sale has ended');
        require(whitelisted[msg.sender] == true, 'msg.sender is not whitelisted');

        UserInfo storage user = userInfo[msg.sender];

        require(
            cap >= user.amount.add(_amount),
            'new amount above user limit'
            );

        user.amount = user.amount.add(_amount);
        totalRaised = totalRaised.add(_amount);

        DAI.safeTransferFrom( msg.sender, DAO, _amount );

        uint payout = user.amount.mul(1e18).div(price).div(1e9);
        user.payout = payout;
        totalDebt = totalDebt.add(payout);

        emit Deposit(msg.sender, _amount);
    }


    // @notice it withdraws sROME from the sale
    function withdraw() external {
        require(claimable, 'sROME is not yet claimable');
        require(whitelisted[msg.sender] == true, 'msg.sender is not whitelisted');

        UserInfo storage user = userInfo[msg.sender];

        require(user.payout > 0, 'msg.sender has not participated');
        require(!user.claimed, 'msg.sender has already claimed');

        user.claimed = true;

        uint256 payout = user.payout;
        user.payout = 0;
        totalDebt = totalDebt.sub(payout);

        sROME.safeTransfer( msg.sender, payout );

        emit Withdraw(msg.sender, payout);
    }
}
