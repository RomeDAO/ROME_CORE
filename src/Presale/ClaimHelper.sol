// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function getPair(address tokenA, address tokenB) external view returns (address pair);

    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IPresale {
    function claimUnlockWithHelper() external;
}

interface IRouter {
    function factory() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
}

contract ClaimHelper is Ownable{
    using SafeERC20 for IERC20;
    using SafeMath for uint;

    address public ROME;

    address public DAO;

    IPresale public DAI_PRESALE;

    modifier onlyDAO() {
        require( DAO == msg.sender, "Ownable: caller is not DAO" );
        _;
    }

    constructor(address _ROME, address _DAO) {
        require( _ROME != address(0) );
        ROME = _ROME;
        require( _DAO != address(0) );
        DAO = _DAO;
    }

    function setPresale(address _DAI_PRESALE) external onlyOwner returns ( bool ){
        require( _DAI_PRESALE != address(0) );
        DAI_PRESALE = IPresale(_DAI_PRESALE);
        return true;

    }

    function Claim(
        uint256 _amountRome,
        uint256 _amountToken,
        uint256 _amountMinRome,
        uint256 _amountMinToken,
        address _router,
        address _token
    ) external onlyDAO {
        require( address(DAI_PRESALE) != address(0) );
        require( _amountMinRome < _amountRome && _amountMinToken < _amountToken, "Min Amount must be smaller than amount desired");

        IRouter router = IRouter(_router);

        IERC20( ROME ).safeTransferFrom( msg.sender, address(this), _amountRome);
        IERC20( _token ).safeTransferFrom( msg.sender, address(this), _amountToken);

        require(
            IERC20( ROME ).balanceOf(address(this)) >= _amountRome,
            'not enough ROME'
            );
        require(
            IERC20( _token ).balanceOf(address(this)) >= _amountToken,
            'not enough Token'
            );

        IERC20( ROME ).approve( address( router ), _amountRome );
        IERC20( _token ).approve( address( router ), _amountToken );

        // add frax liquidity 8$
        router.addLiquidity(
            ROME, // token A
            _token, // token B
            _amountRome, // amount A Desired (1e9)
            _amountToken, // amount B Desired (1e18)
            _amountMinRome, // amount A Min
            _amountMinToken, // amount B Min
            DAO, // to
            block.timestamp // deadline
        );

        DAI_PRESALE.claimUnlockWithHelper();
    }

}
