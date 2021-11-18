import {getNamedAccounts,ethers} from 'hardhat';


async function main() {
  const {deployer,DAO,WARCHEST} = await getNamedAccounts();

  const frax = await ethers.getContract('mockFRAX');
  const treasury = await ethers.getContract('RomeTreasury');

  const amount = '3000000000000000000000000' // 3mil

  await frax.mint(WARCHEST,amount);

  // const signer = await ethers.getSigner(DAO);

  // await frax.connect( signer ).approve(treasury.address,amount);
  // await treasury.connect( signer ).deposit('300000000000000000000000', frax.address, '0');
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
