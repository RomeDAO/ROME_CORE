yarn deploy localhost --tags TREASURY
yarn deploy localhost --tags STAKING
yarn deploy localhost --tags BONDS
yarn execute localhost ./scripts/test-launch/02_sequence/01_initTreasury.ts
yarn execute localhost ./scripts/test-launch/02_sequence/02_initStaking.ts
yarn execute localhost ./scripts/test-launch/02_sequence/03_initBonds.ts
yarn execute localhost ./scripts/test-launch/02_sequence/04_queueTreasury.ts
yarn execute localhost ./scripts/test-launch/02_sequence/05_toggleTreasury.ts