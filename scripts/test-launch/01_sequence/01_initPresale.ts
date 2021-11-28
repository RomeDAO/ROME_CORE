import {ethers, getNamedAccounts} from 'hardhat';

async function main() {
  const {DAO} = await getNamedAccounts();

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

  // start presale
  // should be at the end
  // const startTx = await presale.start();
  // await startTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
