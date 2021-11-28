yarn deploy localhost --tags PRESALE
yarn execute localhost ./scripts/test-launch/01_initPresale.ts
yarn execute localhost ./scripts/test-launch/02_whitelist.ts