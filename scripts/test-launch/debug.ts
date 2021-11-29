import {ethers} from 'hardhat';
import {testAddresses} from './testConstants';

async function main() {
  const dai = await ethers.getContract('mockDAI');
  const frax = await ethers.getContract('mockFRAX');

  const addresses = testAddresses;

  //   // mint dai for everyone
  //   for (const address of addresses) {
  //     const mintTx = await dai.mint(address, ethers.utils.parseUnits('1500', 18));
  //     await mintTx.wait();
  //     console.log('minted dai for ' + address);
  //   }

  // mint frax for everyone

  const mintTx = await frax.mint(
    '0x9Cc0341F2412A9D22CDcd027C6Cc710330c5325e',
    ethers.utils.parseUnits('100000000', 18)
  );
  await mintTx.wait();
  console.log('minted frax for ' + '0x9Cc0341F2412A9D22CDcd027C6Cc710330c5325e');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
