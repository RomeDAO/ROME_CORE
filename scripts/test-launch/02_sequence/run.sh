yarn deploy moonbase --tags TREASURY
yarn deploy moonbase --tags STAKING
yarn deploy moonbase --tags BONDS
yarn execute moonbase ./scripts/test-launch/02_sequence/01_initTreasury.ts
yarn execute moonbase ./scripts/test-launch/02_sequence/02_initStaking.ts
yarn execute moonbase ./scripts/test-launch/02_sequence/03_initBonds.ts
yarn execute moonbase ./scripts/test-launch/02_sequence/04_queueTreasury.ts
yarn execute moonbase ./scripts/test-launch/02_sequence/05_toggleTreasury.ts