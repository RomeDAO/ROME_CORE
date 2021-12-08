import {getNamedAccounts,ethers} from 'hardhat';
import {MIMBOND,ROMEFRAXBOND,zeroAddress} from '../utils/constants';

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const Treasury = await ethers.getContract('RomeTreasury');

  console.log('Treasury @ ', Treasury.address);

  // queue reserve depositor toggle for bonds and DAO
  // await Treasury.queue( '0', FraxBonds.address );
  await Treasury.queue( '0', MIMBOND );
  // queue liquidity depositor toggle for bonds
  await Treasury.queue( '4', ROMEFRAXBOND );
  // queue reserve depositor toggle for distributor
  // await Treasury.queue( '8', Distributor.address );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
