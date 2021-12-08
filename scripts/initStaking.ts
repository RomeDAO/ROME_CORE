import {getNamedAccounts,ethers} from 'hardhat';
import {startingIndex,initialRewardRate} from '../utils/constants';

async function main() {
  const {DAO,OPS} = await getNamedAccounts();

  // get contracts
  const Staking = await ethers.getContract('RomeStaking');
  const sROME = await ethers.getContract('sRome');
  const StakingWarmup = await ethers.getContract('StakingWarmup');
  const Distributor = await ethers.getContract('Distributor');

  // sROME
  let tx = await sROME.initialize( Staking.address );
  tx.wait();
  tx = await sROME.setIndex( startingIndex );
  tx.wait();
  tx = await sROME.pushPolicy( DAO );
  tx.wait();

  // Staking
  tx = await Staking.setContract( '0', Distributor.address );
  tx.wait();
  tx = await Staking.setContract( '1', StakingWarmup.address );
  tx.wait();
  tx = await Staking.setWarmup( '0' );
  tx.wait();
  tx = await Staking.pushPolicy( OPS );
  tx.wait();

  // Distributor
  tx = await Distributor.addRecipient( Staking.address, initialRewardRate );
  tx.wait();
  tx = await Distributor.pushPolicy( DAO );
  tx.wait();

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
