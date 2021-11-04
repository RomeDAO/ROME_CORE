import {getNamedAccounts,ethers} from 'hardhat';

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const ROME = await ethers.getContract('Rome');
  const aROME = await ethers.getContract('aRome');
  const Presale = await ethers.getContract('DaiRomePresale');
  const Treasury = await ethers.getContract('RomeTreasury');
  const Distributor = await ethers.getContract('Distributor');

  // ROME
  await ROME.setVault( Treasury.address );

  // aROME
  await aROME.setPresale( Presale.address );
  await aROME.pushManagement( DAO );

  // WMOVR Bonds
  const MovrBonds = await ethers.getContract('MOVRBondDepository');

  // ROME/FRAX Bonds
  const RomeFraxBonds = await ethers.getContract('ROMEFRAXBondDepository');

  // FRAX Bonds
  const FraxBonds = await ethers.getContract('FRAXBondDepository');

  // MIM Bonds
  const MimBonds = await ethers.getContract('MIMBondDepository');

  // queue reserve depositor toggle for bonds and DAO
  await Treasury.queue( '0', FraxBonds.address );
  await Treasury.queue( '0', MimBonds.address );
  await Treasury.queue( '0', DAO );
  // queue liquidity depositor toggle for bonds
  await Treasury.queue( '4', RomeFraxBonds.address );
  // queue reserve depositor toggle for bonds
  await Treasury.queue( '8', MovrBonds.address );
  await Treasury.queue( '8', Distributor.address );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
