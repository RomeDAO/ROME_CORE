import {ethers, getNamedAccounts} from 'hardhat';

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

  // approve dai spending
  const approveTx = await dai.connect(addr1).approve(presale.address, ethers.utils.parseEther('1500'));
  await approveTx.wait();

  // deposit some DAI and buy some aROME
  const buyTx = await presale.connect(addr1).deposit(ethers.utils.parseEther('1500'));
  await buyTx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
