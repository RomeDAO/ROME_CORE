import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {ethers} from 'hardhat';

async function main(hre: HardhatRuntimeEnvironment) {
  const {DAO,OPS} = await hre.getNamedAccounts();

  const sROME = await ethers.getContract('sRome');
  await sROME.pushManagement( DAO );

  const Staking = await ethers.getContract('RomeStaking');
  await Staking.pushManagement( OPS );

  const Treasury = await ethers.getContract('RomeTreasury');
  await Treasury.pushPolicy( DAO );

  const ROME = await ethers.getContract('Rome');
  await ROME.pushManagement( DAO );

  const Distributor = await ethers.getContract('Distributor');
  await Distributor.pushPolicy( DAO );

  const RedeemHelper = await ethers.getContract('RedeemHelper');
  await RedeemHelper.pushManagement( OPS );

  const aROME = await ethers.getContract('aRome');
  await aROME.pushManagement( DAO );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
