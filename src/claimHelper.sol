// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import './Libraries/Ownable.sol';
import './Libraries/SafeERC20.sol';

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
    function WETH() external pure returns (address);

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
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
}

contract ClaimHelper is Ownable{
    using SafeERC20 for IERC20;

    address public FRAX = 0x1A93B23281CC1CDE4C4741353F3064709A16197d;

    address public MIM = 0x0caE51e1032e8461f4806e26332c030E34De3aDb;

    address public WMOVR = 0x98878B06940aE243284CA214f92Bb71a2b032B8A;

    address public ROME;

    address public DAO;

    IPresale public PRESALE;

    constructor(address _ROME, address _PRESALE, address _DAO) {
        require( _ROME != address(0) );
        ROME = _ROME;
        require( _ROME != address(0) );
        PRESALE = IPresale(_PRESALE);
        require( _DAO != address(0) );
        DAO = _DAO;
    }

    function Claim() external onlyOwner {
        // Sushi Router
        IRouter router = IRouter(0xc35DADB65012eC5796536bD9864eD8773aBc74C4);

        require(
            IERC20( ROME ).balanceOf(msg.sender) >= (74975 * 1e9),
            'msg.sender does not have enough ROME'
            );
        require(
            IERC20( FRAX ).balanceOf(msg.sender) >= (200000 * 1e18),
            'msg.sender does not have enough FRAX'
            );
        require(
            IERC20( MIM ).balanceOf(msg.sender) >= (200000 * 1e18),
            'msg.sender does not have enough MIM'
            );
        require(
            IERC20( WMOVR ).balanceOf(msg.sender) >= (555 * 1e18),
            'msg.sender does not have enough WMOVR'
            );
        // add frax liquidity 8$
        router.addLiquidity(
            ROME, // token A
            FRAX, // token B
            25000 * 1e9, // amount A Desired (1e9)
            200000 * 1e18, // amount B Desired (1e18)
            25000 * 1e9, // amount A Min
            200000 * 1e18, // amount B Min
            DAO, // to
            block.timestamp // deadline
        );

        // Solar Router
        router = IRouter(0x049581aEB6Fe262727f290165C29BDAB065a1B68);

        // add mim liquidity 8$
        router.addLiquidity(
            ROME, // token A
            MIM, // token B
            25000 * 1e9, // amount A Desired (1e9)
            200000 * 1e18, // amount B Desired (1e18)
            25000 * 1e9, // amount A Min
            200000 * 1e18, // amount B Min
            DAO, // to
            block.timestamp // deadline
        );

        // add movr liquidity MOVR = 360$
        router.addLiquidity(
            ROME, // token A
            WMOVR, // token B
            24975 * 1e9, // amount A Desired (1e9)
            555 * 1e18, // amount B Desired (1e18)
            25000 * 1e9, // amount A Min
            277 * 1e18, // amount B Min
            DAO, // to
            block.timestamp // deadline
        );

        PRESALE.claimUnlockWithHelper();
    }

}
