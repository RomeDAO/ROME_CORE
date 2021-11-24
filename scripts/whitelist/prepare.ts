import {ethers, getNamedAccounts} from 'hardhat';

// prepares whitelist and sets up everything needed
// useful to test the actual journey in the ui: approve -> deposit

async function main() {
  const {DAO} = await getNamedAccounts();
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  // get contracts
  const aROME = await ethers.getContract('aRome');
  const presale = await ethers.getContract('DaiRomePresale');
  const dai = await ethers.getContract('mockDAI');

  // set presale parameters
  console.log('aRome.SetPresale()');
  const setTx = await aROME.setPresale(presale.address);
  await setTx.wait();
  console.log('txSent');

  // push policy
  console.log('aRome.pushPolicy()');
  const policyTx = await aROME.pushPolicy(DAO);
  await policyTx.wait();
  console.log('txSent');

  // whitelist user for presal
  const presaleTx = await presale.addMultipleWhitelist([owner.address, addr1.address]);
  await presaleTx.wait();

  // mint some DAI
  const mintTx = await dai.connect(addr1).mint(addr1.address, ethers.utils.parseEther('1500'));
  await mintTx.wait();

  // start presale
  const startTx = await presale.start();
  await startTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
