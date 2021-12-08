import {getNamedAccounts,ethers} from 'hardhat';
import whitelist_0 from './json/whitelist_0.json';
import whitelist_1 from './json/whitelist_1.json';
import whitelist_2 from './json/whitelist_2.json';
import whitelist_3 from './json/whitelist_3.json';
import whitelist_4 from './json/whitelist_4.json';
import whitelist_5 from './json/whitelist_5.json';
import whitelist_6 from './json/whitelist_6.json';

// Delaying as for some reason tx.wait() did not fix issues with testnet deployment
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const {WARCHEST} = await getNamedAccounts();

  const Presale = await ethers.getContract('DaiRomePresale');

  // Public Whitelist
  console.log('0/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_0);
  console.log('tx sent');
  await delay(15000);
  console.log('1/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_1);
  console.log('tx sent');
  await delay(15000);
  console.log('2/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_2);
  console.log('tx sent');
  await delay(15000);
  console.log('3/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_3);
  console.log('tx sent');
  await delay(15000);
  console.log('4/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_4);
  console.log('tx sent');
  await delay(15000);
  console.log('5/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_5);
  console.log('tx sent');
  await delay(15000);
  console.log('6/6 whitelist chunks...');
  await Presale.addMultipleWhitelist(whitelist_6);
  console.log('tx sent');
  await delay(15000);

  // Team Whitelist
  console.log('team');
  await Presale.addTeam(WARCHEST, '241');


}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
