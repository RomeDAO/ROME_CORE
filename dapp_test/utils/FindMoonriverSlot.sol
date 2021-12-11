// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma experimental ABIEncoderV2;

import "../../lib/ds-test/test.sol";

// interface IERC20 {
//     function balanceOf(address acount) external returns (uint256);
// }
// interface IRomeAuthority {
//     function vault() external view returns (address);
// }
// interface IVault {
//     function totalReserves() external view returns (uint);
// }

// interface IHEVM {
//     function store(
//         address c,
//         bytes32 loc,
//         bytes32 val
//     ) external;
// }

// contract MoonriverTestSetBalance is DSTest {
//     function test_HevmStoreMIM() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         address MIM = 0x0caE51e1032e8461f4806e26332c030E34De3aDb;
//         IERC20 mim = IERC20(MIM);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 MIM,
//                 keccak256(
//                     abi.encode(
//                         0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d,
//                         uint256(i)
//                     )
//                 ),
//                 bytes32(uint256(10 * 1e6))
//             );
//             uint256 balance = mim.balanceOf(
//                 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d
//             );
//             if (balance == 10 * 1e6) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(2, index);
//     }

//     function test_HevmStoreFRAX() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         address FRAX = 0x1A93B23281CC1CDE4C4741353F3064709A16197d;
//         IERC20 frax = IERC20(FRAX);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 FRAX,
//                 keccak256(
//                     abi.encode(
//                         0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d,
//                         uint256(i)
//                     )
//                 ),
//                 bytes32(uint256(10 * 1e6))
//             );
//             uint256 balance = frax.balanceOf(
//                 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d
//             );
//             if (balance == 10 * 1e6) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(0, index);
//     }

//     function test_HevmStoreDAI() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         address DAI = 0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844;
//         IERC20 dai = IERC20(DAI);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 DAI,
//                 keccak256(
//                     abi.encode(
//                         0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d,
//                         uint256(i)
//                     )
//                 ),
//                 bytes32(uint256(10 * 1e6))
//             );
//             uint256 balance = dai.balanceOf(
//                 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d
//             );
//             if (balance == 10 * 1e6) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(2, index);
//     }

//     function test_HevmStoreROMEMOVR() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         IERC20 ROMEMOVR = IERC20(0x0ceE045861051f8f5FD4e62622F87556c8e555B6);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 address( ROMEMOVR ),
//                 keccak256(
//                     abi.encode(
//                         0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d,
//                         uint256(i)
//                     )
//                 ),
//                 bytes32(uint256(10 * 1e6))
//             );
//             uint256 balance = ROMEMOVR.balanceOf(
//                 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d
//             );
//             if (balance == 10 * 1e6) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(1, index);
//     }

//     function test_HevmStoreROME() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         IERC20 ROME = IERC20(0x4a436073552044D5f2f49B176853ad3Ad473d9d6);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 address( ROME ),
//                 keccak256(
//                     abi.encode(
//                         0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d,
//                         uint256(i)
//                     )
//                 ),
//                 bytes32(uint256(10 * 1e6))
//             );
//             uint256 balance = ROME.balanceOf(
//                 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d
//             );
//             if (balance == 10 * 1e6) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(0, index);
//     }

//     function test_HevmStoreWMOVR() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         IERC20 WMOVR = IERC20(0x98878B06940aE243284CA214f92Bb71a2b032B8A);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 address( WMOVR ),
//                 keccak256(
//                     abi.encode(
//                         0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d,
//                         uint256(i)
//                     )
//                 ),
//                 bytes32(uint256(10 * 1e6))
//             );
//             uint256 balance = WMOVR.balanceOf(
//                 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d
//             );
//             if (balance == 10 * 1e6) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(3, index);
//     }

//     function test_HevmStoreVAULT() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         IRomeAuthority AUTH = IRomeAuthority(0x59FceceC609dAB272C7302afC5F8f90bac9d771D);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 address( AUTH ),
//                 bytes32(i),
//                 bytes32(uint256(0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d))
//             );

//             address vault = AUTH.vault();
//             if (vault == 0x3a3eE61F7c6e1994a2001762250A5E17B2061b6d) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(5, index);
//     }

//     function test_HevmStoreVaultReserves() public {
//         IHEVM hevm = IHEVM(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
//         IVault VAULT = IVault(0xfbAD41e4Dd040BC80c89FcC6E90d152A746139aF);

//         uint256 index;
//         for (uint256 i = 0; i < 100; i++) {
//             hevm.store(
//                 address( VAULT ),
//                 bytes32(i),
//                 bytes32(uint(123*1e18))
//             );
//             uint256 reserves = VAULT.totalReserves();
//             if (reserves == 123*1e18) {
//                 index = i;
//                 break;
//             }
//         }

//         assertEq(33, index);
//     }
// }
