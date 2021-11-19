// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

interface IAlphaRome {
    function mint(address account_, uint256 amount_) external;
}

contract mockPresale is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct UserInfo {
        uint256 amount; // Amount DAI deposited by user
        uint256 debt; // total ROME claimed thus aROME debt
        bool claimed; // True if a user has claimed ROME
    }

    struct TeamInfo {
        uint256 numWhitelist; // number of whitelists
        uint256 amount; // Amout DAI deposited by team
        uint256 debt; // total ROME claimed thus aROME debt
        bool claimed; // True if a team member has claimed ROME
    }

    // Tokens to raise (DAI) & (FRAX) and for offer (aROME) which can be swapped for (ROME)
    IERC20 public DAI; // for user deposits
    IERC20 public FRAX; // for team deposits
    IERC20 public aROME;
    IERC20 public ROME;

    address public DAO; // Multisig treasury to send proceeds to

    uint256 public price = 20 * 1e18; // 20 DAI per ROME

    uint256 public cap = 1500 * 1e18; // 1500 DAI cap per whitelisted user

    uint256 public totalRaisedDAI; // total DAI raised by sale
    uint256 public totalRaisedFRAX; // total FRAX raised by sale

    uint256 public totalDebt; // total aROME and thus ROME owed to users

    bool public started; // true when sale is started

    bool public ended; // true when sale is ended

    bool public claimable; // true when sale is claimable

    bool public claimAlpha; // true when aROME is claimable

    address public claimHelper; // address of claimingHelper contract

    mapping(address => UserInfo) public userInfo;

    mapping(address => TeamInfo) public teamInfo;

    mapping(address => bool) public whitelisted; // True if user is whitelisted

    mapping(address => bool) public whitelistedTeam; // True if team member is whitelisted

    mapping(address => uint256) public romeClaimable; // amount of rome claimable by address

    event Deposit(address indexed who, uint amount);
    event Withdraw(address token, address indexed who, uint amount);
    event Mint(address token, address indexed who, uint amount);
    event SaleStarted(uint block);
    event SaleEnded(uint block);
    event ClaimUnlocked(uint block);
    event ClaimAlphaUnlocked(uint block);
    event AdminWithdrawal(address token, uint amount, address indexed admin);

    constructor(
        address _aROME,
        address _ROME,
        address _DAI,
        address _FRAX,
        address _DAO,
        address _claimHelper
    ) {
        require( _aROME != address(0) );
        aROME = IERC20(_aROME);
        require( _ROME != address(0) );
        ROME = IERC20(_ROME);
        require( _DAI != address(0) );
        DAI = IERC20(_DAI);
        require( _FRAX != address(0) );
        FRAX = IERC20(_FRAX);
        require( _DAO != address(0) );
        DAO = _DAO;
        require( _claimHelper != address(0) );
        claimHelper = _claimHelper;
    }

    /**
     *  @notice adds a single whitelist to the sale
     *  @param _address: address to whitelist
     */
    function addWhitelist(address _address) external onlyOwner {
        require(!started, "Sale has already started");
        whitelisted[_address] = true;
    }

    /**
     *  @notice adds multiple whitelist to the sale
     *  @param _addresses: dynamic array of addresses to whitelist
     */
    function addMultipleWhitelist(address[] calldata _addresses) external onlyOwner {
        require(!started, "Sale has already started");
        for (uint i = 0; i < _addresses.length; i++) {
            whitelisted[_addresses[i]] = true;
        }
    }

    /**
     *  @notice removes a single whitelist from the sale
     *  @param _address: address to remove from whitelist
     */
    function removeWhitelist(address _address) external onlyOwner {
        require(!started, "Sale has already started");
        whitelisted[_address] = false;
    }
    /**
     *  @notice adds a team member from sale
     *  @param _address: address to whitelist
     *  @param _numWhitelist: number of whitelists for address
     */
    function addTeam(address _address, uint256 _numWhitelist) external onlyOwner {
        require(!started, "Sale has already started");
        require(_numWhitelist != 0, "cannot set zero whitelists");
        whitelistedTeam[_address] = true;
        teamInfo[_address].numWhitelist = _numWhitelist;
    }

    /**
     *  @notice removes a team member from sale
     *  @param _address: address to remove from whitelist
     */
    function removeTeam(address _address) external onlyOwner {
        require(!started, "Sale has already started");
        whitelistedTeam[_address] = false;
        delete teamInfo[_address];
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

    // @notice lets users claim ROME
    // @dev send sufficient ROME before calling
    function claimUnlock() external onlyOwner {
        require(ended, "Sale has not ended");
        require(!claimable, "Claim has already been unlocked");
        require(ROME.balanceOf(address(this)) >= totalDebt, 'not enough ROME in contract');
        claimable = true;
        emit ClaimUnlocked(block.number);
    }

    // @notice lets users claim ROME
    // @dev send sufficient ROME before calling
    function claimUnlockWithHelper() external {
        require(msg.sender == claimHelper, "msg.sender is not claimHelper");
        require(ended, "Sale has not ended");
        require(!claimable, "Claim has already been unlocked");
        require(ROME.balanceOf(address(this)) >= totalDebt, 'not enough ROME in contract');
        claimable = true;
        emit ClaimUnlocked(block.number);
    }

    // @notice lets users claim aROME
    function claimAlphaUnlock() external onlyOwner {
        require(claimable, "Claim has not been unlocked");
        require(!claimAlpha, "Claim Alpha has already been unlocked");
        claimAlpha = true;
        emit ClaimAlphaUnlocked(block.number);
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
        require(whitelisted[msg.sender] == true, 'msg.sender is not whitelisted user');

        UserInfo storage user = userInfo[msg.sender];

        require(
            cap >= user.amount.add(_amount),
            'new amount above user limit'
            );

        user.amount = user.amount.add(_amount);
        totalRaisedDAI = totalRaisedDAI.add(_amount);

        uint payout = _amount.mul(1e18).div(price).div(1e9); // aROME to mint for _amount

        totalDebt = totalDebt.add(payout);

        DAI.safeTransferFrom( msg.sender, DAO, _amount );

        IAlphaRome( address(aROME) ).mint( msg.sender, payout );

        emit Deposit(msg.sender, _amount);
    }
    /**
     *  @notice it deposits FRAX for the sale
     *  @param _amount: amount of FRAX to deposit to sale (18 decimals)
     *  @dev only for team members
     */
    function depositTeam(uint256 _amount) external {
        require(started, 'Sale has not started');
        require(!ended, 'Sale has ended');
        require(whitelistedTeam[msg.sender] == true, 'msg.sender is not whitelisted team');

        TeamInfo storage team = teamInfo[msg.sender];

        require(
            cap.mul(team.numWhitelist) >= team.amount.add(_amount),
            'new amount above team limit'
            );

        team.amount = team.amount.add(_amount);
        totalRaisedFRAX = totalRaisedFRAX.add(_amount);

        uint payout = _amount.mul(1e18).div(price).div(1e9); // ROME debt to claim

        totalDebt = totalDebt.add(payout);

        FRAX.safeTransferFrom( msg.sender, DAO, _amount );

        IAlphaRome( address(aROME) ).mint( DAO, payout );

        emit Deposit(msg.sender, _amount);
    }

    /**
     *  @notice it deposits aROME to withdraw ROME from the sale
     *  @param _amount: amount of aROME to deposit to sale (9 decimals)
     */
    function withdraw(uint256 _amount) external {
        require(claimable, 'ROME is not yet claimable');
        require(_amount > 0, '_amount must be greater than zero');

        UserInfo storage user = userInfo[msg.sender];

        user.debt = user.debt.add(_amount);

        totalDebt = totalDebt.sub(_amount);

        aROME.safeTransferFrom( msg.sender, address(this), _amount );

        ROME.safeTransfer( msg.sender, _amount );

        emit Mint(address(aROME), msg.sender, _amount);
        emit Withdraw(address(ROME), msg.sender, _amount);
    }

    // @notice it checks a users DAI allocation remaining
    function getUserRemainingAllocation(address _user) external view returns ( uint ) {
        UserInfo memory user = userInfo[_user];
        return cap.sub(user.amount);
    }
    // @notice it claims aROME back from the sale
    function claimAlphaRome() external {
        require(claimAlpha, 'aROME is not yet claimable');

        UserInfo storage user = userInfo[msg.sender];

        require(user.debt > 0, 'msg.sender has not participated');
        require(!user.claimed, 'msg.sender has already claimed');

        user.claimed = true;

        uint256 payout = user.debt;
        user.debt = 0;

        aROME.safeTransfer( msg.sender, payout );

        emit Withdraw(address(aROME),msg.sender, payout);
    }

}
