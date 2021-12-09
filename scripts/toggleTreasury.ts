import {getNamedAccounts,ethers} from 'hardhat';
import {zeroAddress} from '../utils/constants';

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const Treasury = await ethers.getContract('RomeTreasury');

  const Distributor = await ethers.getContract('Distributor');

  const RomeFraxBonds = await ethers.getContract('ROMEFRAXBondDepository');

  const FraxBonds = await ethers.getContract('FRAXBondDepository');

  const MimBonds = await ethers.getContract('MIMBondDepository');

  // queue reserve depositor toggle for bonds and DAO
  // await Treasury.toggle( '0', FraxBonds.address, zeroAddress );
  // await Treasury.toggle( '0', MimBonds.address, zeroAddress );
  // // queue liquidity depositor toggle for bonds
  // await Treasury.toggle( '4', RomeFraxBonds.address, zeroAddress );
  // // queue reserve depositor toggle for distributor
  // await Treasury.toggle( '8', Distributor.address, zeroAddress );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
