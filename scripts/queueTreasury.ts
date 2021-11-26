import {getNamedAccounts, ethers} from 'hardhat';
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
  await Treasury.queue('0', FraxBonds.address);
  await Treasury.queue('0', MimBonds.address);
  // queue liquidity depositor toggle for bonds
  await Treasury.queue('4', RomeFraxBonds.address);
  // queue reserve depositor toggle for distributor
  await Treasury.queue('8', Distributor.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
