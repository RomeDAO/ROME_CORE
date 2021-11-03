import {ethers} from 'hardhat';
import {startingIndex,initialRewardRate} from '../utils/constants';

async function main() {

  // get contracts
  const ROME = await ethers.getContract('Rome');
  const sROME = await ethers.getContract('sRome');
  const aROME = await ethers.getContract('aRome');
  const Presale = await ethers.getContract('DaiRomePresale');
  const Treasury = await ethers.getContract('RomeTreasury');
  const Staking = await ethers.getContract('RomeStaking');
  const StakingWarmup = await ethers.getContract('StakingWarmup');
  const Distributor = await ethers.getContract('Distributor');
  const RedeemHelper = await ethers.getContract('RedeemHelper');
  const StakingHelper = await ethers.getContract('StakingHelper');

  // ROME
  await ROME.setVault( Treasury.address );

  // sROME
  await sROME.initialize( Staking.address );
  await sROME.setIndex( startingIndex );

  // aROME
  await aROME.setPresale(Presale.address);

  // Staking
  await Staking.setContract( '0', Distributor.address );
  await Staking.setContract( '1', StakingWarmup.address );
  await Staking.setWarmup( '1' );

  // Distributor
  await Distributor.addRecipient( Staking.address, initialRewardRate );

  // ROME/WMOVR Bonds
  const RomeMovrBonds = await ethers.getContract('ROMEMOVRBondDepository');
  await RomeMovrBonds.setStaking( Staking.address, false );
  await RomeMovrBonds.setStaking( StakingHelper.address, true );
  // await RomeMovrBonds.initializeBondTerms(
  //   bcv,
  //   33100,
  //   minimumPrice,
  //   maxPayout,
  //   10000,
  //   maxDebt,
  //   initialDebt
  //  );

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

  // ROME/MIM Bonds
  const RomeMimBonds = await ethers.getContract('ROMEMIMBondDepository');
  await RomeMimBonds.setStaking( Staking.address, false );
  await RomeMimBonds.setStaking( StakingHelper.address, true );
  // await RomeMimBonds.initializeBondTerms(
  //   bcv,
  //   33100,
  //   minimumPrice,
  //   maxPayout,
  //   10000,
  //   maxDebt,
  //   initialDebt
  //  );

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

  // Redeem Helper
  await RedeemHelper.addBondContract( RomeMovrBonds.address );
  await RedeemHelper.addBondContract( MovrBonds.address );
  await RedeemHelper.addBondContract( RomeFraxBonds.address );
  await RedeemHelper.addBondContract( FraxBonds.address );
  await RedeemHelper.addBondContract( RomeMimBonds.address );
  await RedeemHelper.addBondContract( MimBonds.address );

  // queue reserve depositor toggle for bonds and DAO
  await Treasury.queue( '0', FraxBonds.address );
  await Treasury.queue( '0', MimBonds.address );
  await Treasury.queue( '0', DAO );
  // queue liquidity depositor toggle for bonds
  await Treasury.queue( '4', RomeFraxBonds.address );
  await Treasury.queue( '4', RomeMimBonds.address );
  // queue reserve depositor toggle for bonds
  await Treasury.queue( '8', MovrBonds.address );
  await Treasury.queue( '8', RomeMovrBonds.address );
  await Treasury.queue( '8', Distributor.address );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
