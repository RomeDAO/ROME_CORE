import {ethers,getNamedAccounts} from 'hardhat';

async function main() {
  const {OPS} = await getNamedAccounts();

  // get contracts
  const Staking = await ethers.getContract('RomeStaking');
  const StakingHelper = await ethers.getContract('StakingHelper');

  // WMOVR Bonds
  const MovrBonds = await ethers.getContract('MOVRBondDepository');
  await MovrBonds.setStaking( Staking.address, false );
  await MovrBonds.setStaking( StakingHelper.address, true );
  // await MovrBonds.initializeBondTerms(
  //   bcv,
  //   33100,
  //   minimumPrice,
  //   maxPayout,
  //   10000,
  //   maxDebt,
  //   initialDebt
  //  );
  await MovrBonds.pushPolicy( OPS );

  // ROME/FRAX Bonds
  const RomeFraxBonds = await ethers.getContract('ROMEFRAXBondDepository');
  await RomeFraxBonds.setStaking( Staking.address, false );
  await RomeFraxBonds.setStaking( StakingHelper.address, true );
  // await RomeFraxBonds.initializeBondTerms(
  //   bcv,
  //   33100,
  //   minimumPrice,
  //   maxPayout,
  //   10000,
  //   maxDebt,
  //   initialDebt
  //  );
  await RomeFraxBonds.pushPolicy( OPS );

  // FRAX Bonds
  const FraxBonds = await ethers.getContract('FRAXBondDepository');
  await FraxBonds.setStaking( Staking.address, false );
  await FraxBonds.setStaking( StakingHelper.address, true );
  // await FraxBonds.initializeBondTerms(
  //   bcv,
  //   33100,
  //   minimumPrice,
  //   maxPayout,
  //   10000,
  //   maxDebt,
  //   initialDebt
  //  );
  await FraxBonds.pushPolicy( OPS );

  // MIM Bonds
  const MimBonds = await ethers.getContract('MIMBondDepository');
  await MimBonds.setStaking( Staking.address, false );
  await MimBonds.setStaking( StakingHelper.address, true );
  // await MimBonds.initializeBondTerms(
  //   bcv,
  //   33100,
  //   minimumPrice,
  //   maxPayout,
  //   10000,
  //   maxDebt,
  //   initialDebt
  //  );
  await MimBonds.pushPolicy( OPS );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
