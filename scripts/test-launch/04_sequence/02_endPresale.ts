import {ethers} from 'hardhat';

// this script mints rome tokens and transfers them to the presale contract so users can try to claim them
async function main() {
  const presale = await ethers.getContract('DaiRomePresale');

  // end sale
  console.log('end presale');
  const endTx = await presale.end();
  await endTx.wait();

  // ready the presale contract
  console.log('unlocking claim on presale');
  const unlockTx = await presale.claimUnlock();
  await unlockTx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
