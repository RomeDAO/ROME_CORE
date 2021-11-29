import {getNamedAccounts, ethers} from 'hardhat';

async function main() {
  const presale = await ethers.getContract('DaiRomePresale');
  const tx = await presale.start();
  await tx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
