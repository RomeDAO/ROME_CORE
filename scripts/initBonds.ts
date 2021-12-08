import {ethers,getNamedAccounts} from 'hardhat';
import {
  maxPayout,
  vestingPeriod,
  daoTax,
  fraxMinPrice,
  fraxMaxDebt,
  fraxBcv,
  mimMinPrice,
  mimMaxDebt,
  mimBcv,
  romefraxMinPrice,
  romefraxMaxDebt,
  romefraxBcv,
} from '../utils/constants';

async function main() {
  const {OPS} = await getNamedAccounts();

  // get contracts
  const Staking = await ethers.getContract('RomeStaking');
  const StakingHelper = await ethers.getContract('StakingHelper');

  console.log("Entering RomeFrax Bonds");
  // ROME/FRAX Bonds
  const RomeFraxBonds = await ethers.getContract('ROMEFRAXBondDepository');
  let tx = await RomeFraxBonds.setStaking( Staking.address, false );
  tx.wait();
  tx = await RomeFraxBonds.setStaking( StakingHelper.address, true );
  tx.wait();

  tx = await RomeFraxBonds.pushPolicy( OPS );
  tx.wait();

  console.log("Entering Mim Bonds");
  // MIM Bonds
  const MimBonds = await ethers.getContract('MIMBondDepository');
  tx = await MimBonds.setStaking( Staking.address, false );
  tx.wait();
  tx = await MimBonds.setStaking( StakingHelper.address, true );

  tx = await MimBonds.pushPolicy( OPS );
  tx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



  // const FraxBonds = await get('FRAXBondDepository');
  // await redeemHelper.addBondContract(FraxBonds.address);

  // const MimBonds = await get('MIMBondDepository');
  // await redeemHelper.addBondContract(MimBonds.address);

  // const RomeFraxBonds = await get('ROMEFRAXBondDepository');
  // await redeemHelper.addBondContract(RomeFraxBonds.address);
