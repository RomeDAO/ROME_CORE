import {ethers} from 'hardhat';
import {testAddresses} from '../testConstants';

async function main() {
  const presale = await ethers.getContract('DaiRomePresale');

  // whitelist user for presale
  const presaleTx = await presale.addMultipleWhitelist(testAddresses);
  await presaleTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
