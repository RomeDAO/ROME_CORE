yarn deploy localhost --tags PRESALE
yarn execute localhost ./scripts/test-launch/01_sequence/01_initPresale.ts
yarn execute localhost ./scripts/test-launch/01_sequence/02_whitelist.ts