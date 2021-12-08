import {getNamedAccounts,ethers} from 'hardhat';

async function main() {
  const {DAO,OPS} = await getNamedAccounts();

  const sROME = await ethers.getContract('sRome');

  const Treasury = await ethers.getContract('RomeTreasury');
  await Treasury.pushPolicy( DAO );

  const ROME = await ethers.getContract('Rome');
  await ROME.pushPolicy( DAO );

  const RedeemHelper = await ethers.getContract('RedeemHelper');
  await RedeemHelper.pushPolicy( OPS );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
