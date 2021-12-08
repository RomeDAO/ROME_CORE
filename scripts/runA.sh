yarn deploy moonriver --tags TREASURY
yarn execute moonriver ./scripts/initTreasury.ts
yarn deploy moonriver --tags BONDS
yarn deploy moonriver --tags STAKING
yarn execute moonriver ./scripts/queueTreasury.ts

