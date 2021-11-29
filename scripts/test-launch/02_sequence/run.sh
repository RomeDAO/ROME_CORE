yarn deploy $1 --tags TREASURY
yarn deploy $1 --tags STAKING
yarn deploy $1 --tags BONDS
yarn execute $1 ./scripts/test-launch/02_sequence/01_initTreasury.ts
yarn execute $1 ./scripts/test-launch/02_sequence/02_initStaking.ts
yarn execute $1 ./scripts/test-launch/02_sequence/03_initBonds.ts
yarn execute $1 ./scripts/test-launch/02_sequence/04_queueTreasury.ts
yarn execute $1 ./scripts/test-launch/02_sequence/05_toggleTreasury.ts