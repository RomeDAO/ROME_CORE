// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
import "./utils/RomeSetup.sol";
import "../src/Protocol/libraries/SafeMath.sol";

// contract deployLiquidity is RomeTest {
//     using SafeMath for uint;

//     function testAddLiquidity() public {
//         uint amountFrax = 500000*1e18;
//         uint amountRome = 500*1e9;
//         FRAX.mint(address(this),amountFrax);
//         ROME.mint(address(this),amountRome);
//         emit log_named_uint("Frax Balance", FRAX.balanceOf(address(this)).div(1e18));
//         emit log_named_uint("Rome Balance", ROME.balanceOf(address(this)).div(1e9));

//         address pair = solarFactory.createPair(address( FRAX ), address( ROME ));

//         FRAX.approve(address( solarRouter ),amountFrax);
//         ROME.approve(address( solarRouter ),amountRome);
//         solarRouter.addLiquidity(
//             address( FRAX ),
//             address( ROME ),
//             amountFrax,
//             amountRome,
//             amountFrax,
//             amountRome,
//             address(this),
//             block.timestamp
//             );
//     }

// }
