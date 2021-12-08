// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "../../lib/ds-test/test.sol";
import "../../src/Protocol/RomeERC20.sol";
import "../../src/Protocol/RomeAuthority.sol";


// contract RomeERC20TokenTest is DSTest {
//     Rome internal romeContract;

//     IRomeAuthority internal authority;

//     address internal UNAUTHORIZED_USER = address(0x1);


//     function test_erc20() public {
//         authority = new RomeAuthority(address(this), address(this), address(this), address(this));
//         romeContract = new Rome(address(authority));
//         assertEq("Rome", romeContract.name());
//         assertEq("ROME", romeContract.symbol());
//         assertEq(9, int(romeContract.decimals()));
//     }

//     function testCannot_mint() public {
//         authority = new RomeAuthority(address(this), address(this), address(this), UNAUTHORIZED_USER);
//         romeContract = new Rome(address(authority));
//         // try/catch block pattern copied from https://github.com/Anish-Agnihotri/MultiRaffle/blob/master/src/test/utils/DSTestExtended.sol
//         try romeContract.mint(address(this), 100) {
//             fail();
//         } catch Error(string memory error) {
//             // Assert revert error matches expected message
//             assertEq("UNAUTHORIZED", error);
//         }
//     }

//     // Tester will pass it's own parameters, see https://fv.ethereum.org/2020/12/11/symbolic-execution-with-ds-test/
//     function test_mint(uint256 amount) public {
//         authority = new RomeAuthority(address(this), address(this), address(this), address(this));
//         romeContract = new Rome(address(authority));
//         uint256 supplyBefore = romeContract.totalSupply();
//          // TODO look into https://dapphub.chat/channel/dev?msg=HWrPJqxp8BHMiKTbo
//         // romeContract.setVault(address(this)); //TODO WTF msg.sender doesn't propigate from .dapprc $DAPP_TEST_CALLER config via mint() call, must use this value
//         romeContract.mint(address(this), amount);
//         assertEq(supplyBefore + amount, romeContract.totalSupply());
//     }

//     // Tester will pass it's own parameters, see https://fv.ethereum.org/2020/12/11/symbolic-execution-with-ds-test/
//     function test_burn(uint256 mintAmount, uint256 burnAmount) public {
//         authority = new RomeAuthority(address(this), address(this), address(this), address(this));
//         romeContract = new Rome(address(authority));
//         uint256 supplyBefore = romeContract.totalSupply();
//         // romeContract.setVault(address(this));  //TODO WTF msg.sender doesn't propigate from .dapprc $DAPP_TEST_CALLER config via mint() call, must use this value
//         romeContract.mint(address(this), mintAmount);
//         if (burnAmount <= mintAmount){
//             romeContract.burn(burnAmount);
//             assertEq(supplyBefore + mintAmount - burnAmount, romeContract.totalSupply());
//         } else {
//             try romeContract.burn(burnAmount) {
//                 fail();
//             } catch Error(string memory error) {
//                 // Assert revert error matches expected message
//                 assertEq("ERC20: burn amount exceeds balance", error);
//             }
//         }
//     }
// }
