import {getNamedAccounts, ethers} from 'hardhat';

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const Treasury = await ethers.getContract('RomeTreasury');
  const Authority = await ethers.getContract('RomeAuthority');

  // push own address
  await Authority.pushVault(my.address, true);

  // mint some rome to own address
  // code

  // set treasury as authority again
  await Authority.pushVault(Treasury.address, true);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
