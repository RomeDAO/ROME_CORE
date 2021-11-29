import {ethers} from 'hardhat';
import {testAddresses} from '../testConstants';

async function main() {
  const dai = await ethers.getContract('mockDAI');
  const frax = await ethers.getContract('mockFRAX');

  const addresses = testAddresses;

  // mint dai for everyone
  for (const address of addresses) {
    const mintTx = await dai.mint(address, ethers.utils.parseUnits('1500', 18));
    await mintTx.wait();
    console.log('minted dai for ' + address);
  }

  // mint frax for everyone
  for (const address of addresses) {
    const mintTx = await frax.mint(address, ethers.utils.parseUnits('10000', 18));
    await mintTx.wait();
    console.log('minted frax for ' + address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
