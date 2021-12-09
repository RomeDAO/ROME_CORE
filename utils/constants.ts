export const zeroAddress = '0x0000000000000000000000000000000000000000';
export const initialRewardRate = '6330'; // 5000 = 0.5%
export const startingIndex = '1000000000'; // 1e9, index of 1
export const firstEpochNumber = '1';
export const epochLength = '2200'; // >8 hours

/**
 * @dev rebases come after distribute. Rebases distribute previous distribution
 * therefore the first rebase will rebase 0 no matter what, the second rebase
 * will distribute the first distribution sent.
 * genesis rebase 2200 blocks offset from deployment.
 * first actual rebase 4400 blocks from deployment.
 */
export const firstBlockOffset = '2200';

export const firstEpochBlock = '993734';

// Moonriver Mainnet Addresses
export const FRAX = '0x1A93B23281CC1CDE4C4741353F3064709A16197d';
export const MIM = '0x0caE51e1032e8461f4806e26332c030E34De3aDb';
export const WMOVR = '0x98878B06940aE243284CA214f92Bb71a2b032B8A';
export const DAI = '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844';

export const SOLARFACTORY = '0x049581aEB6Fe262727f290165C29BDAB065a1B68';
export const SUSHIFACTORY = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';

// BONDS VARIABLES //
export const maxPayout = '100'; // 100000 = 100%
export const vestingPeriod = '32000'; // 5 days
export const daoTax = '1000'; // 10 Percent
// Frax Bonds
export const fraxBcv = '270';
export const fraxMinPrice = '90000'; // 900 dollar floor
export const fraxMaxDebt = '5000000000000000'; // 5 million Rome
// Mim Bonds
export const mimBcv = '270';
export const mimMinPrice = '90000'; // 900 dollars floor
export const mimMaxDebt = '5000000000000000'; // 5 million Rome
// RomeFrax Bonds
export const romefraxBcv = '60';
export const romefraxMinPrice = '2193'; // 850 dollar floor
export const romefraxMaxDebt = '5000000000000000'; // 5 million Rome

// Deployed Contracts
export const AUTHORITY = '0x59FceceC609dAB272C7302afC5F8f90bac9d771D';
export const AROME = '0x3D2D044E8C6dAd46b4F7896418d3d4DFaAD902bE';
export const ROME = '0x4a436073552044D5f2f49B176853ad3Ad473d9d6';
export const CALCULATOR = '0x3b5bbC9d8243C6661CcadAdE17B68344770c20FD';
export const TREASURY = '0xfbAD41e4Dd040BC80c89FcC6E90d152A746139aF';
export const REDEEMHELPER = '0x697a247544a27bf7F7a172E910c817436DE2b9B1';
export const SROME = '0x89f52002e544585b42f8c7cf557609ca4c8ce12a';
export const STAKING = '0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1';
export const STAKINGHELPER = '0x37f9A9436F5dB1ac9e346eAAB482f138DA0D8749';
export const WARMUP = '0x69e09313084137430f878Df52CB0472C481dD3A3';
export const DISTRIBUTOR = '0x5BCF9C0A5fe546990248c5A3AD794409F471f28e';
export const FRAXBOND = '0xE2F71c68db7ECC0c9A907AD2E40E2394c5CAc367';
export const MIMBOND = '0x91a5184741FDc64f7507A7db6Aa3764a747f8089';
export const ROMEFRAXBOND = '0x065588602bd7206B15f9630FDB2e81E4Ca51ad8A';

// Pair Addresses
export const ROMEWMOVR = '0x0ceE045861051f8f5FD4e62622F87556c8e555B6';
export const ROMEFRAX = '0x069C2065100b4D3D982383f7Ef3EcD1b95C05894';

// Price Feeds
export const WMOVRFEED = '0x3f8BFbDc1e79777511c00Ad8591cef888C2113C1';
