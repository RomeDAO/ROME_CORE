import {getNamedAccounts,ethers} from 'hardhat';

async function main() {
  const {deployer,DAO} = await getNamedAccounts();

  const presale = await ethers.getContract('DaiRomePresale');

  await presale.end();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
