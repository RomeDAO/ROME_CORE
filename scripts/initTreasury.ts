import {getNamedAccounts,ethers} from 'hardhat';

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const Treasury = await ethers.getContract('RomeTreasury');
  const Authority = await ethers.getContract('RomeAuthority');

  // Authority
  await Authority.pushVault( Treasury.address, true);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
