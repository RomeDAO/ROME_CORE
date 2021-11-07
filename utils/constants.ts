export const zeroAddress = '0x0000000000000000000000000000000000000000';
export const initialRewardRate = '3000'; // 5000 = 0.5%
export const startingIndex = '1000000000'; // 1e9, index of 1
export const firstEpochNumber = '0';
export const epochLength = '2200'; // ~8 hours

/**
 * @dev rebases come after distribute. Rebases distribute previous distribution
 * therefore the first rebase will rebase 0 no matter what, the second rebase
 * will distribute the first distribution sent.
 */
export const firstEpochBlock = '0'; // block.number of first rebase
export const nextEpochBlock = '0'; // first block.number of distribute

// Moonriver Mainnet Addresses
export const FRAX = '0x1A93B23281CC1CDE4C4741353F3064709A16197d';
export const MIM = '0x0caE51e1032e8461f4806e26332c030E34De3aDb';
export const WMOVR = '0x0caE51e1032e8461f4806e26332c030E34De3aDb';
export const DAI = '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844';

export const SOLARFACTORY = '0x049581aEB6Fe262727f290165C29BDAB065a1B68';
export const SUSHIFACTORY = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';

