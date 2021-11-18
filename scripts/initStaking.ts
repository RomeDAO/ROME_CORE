import {ethers} from 'hardhat';
import {startingIndex,initialRewardRate} from '../../utils/constants';

async function main() {

  // get contracts
  const Staking = await ethers.getContract('RomeStaking');
  const sROME = await ethers.getContract('sRome');
  const StakingWarmup = await ethers.getContract('StakingWarmup');
  const Distributor = await ethers.getContract('Distributor');

  // sROME
  await sROME.initialize( Staking.address );
  await sROME.setIndex( startingIndex );

  // Staking
  await Staking.setContract( '0', Distributor.address );
  await Staking.setContract( '1', StakingWarmup.address );
  await Staking.setWarmup( '1' );

  // Distributor
  await Distributor.addRecipient( Staking.address, initialRewardRate );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
