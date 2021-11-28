yarn deploy localhost --tags PRESALE
yarn execute localhost ./01_mintTokens.ts
yarn execute localhost ./02_initPresale.ts