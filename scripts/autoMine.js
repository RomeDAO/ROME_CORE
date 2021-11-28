const {ethers} = require('hardhat');

const stopMiningAt = 600;

const autoMine = async () => {
  let currentBlockNum = await ethers.provider.getBlockNumber();
  while (currentBlockNum <= stopMiningAt) {
    await ethers.provider.send('evm_mine');
    currentBlockNum = await ethers.provider.getBlockNumber();
  }

  const newBlockNum = await ethers.provider.getBlockNumber();
  console.log(`new block number is ${newBlockNum}`);
};

autoMine()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
