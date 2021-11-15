import {getNamedAccounts,ethers} from 'hardhat';

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const aROME = await ethers.getContract('aRome');
  const Presale = await ethers.getContract('DaiRomePresale');
  const Treasury = await ethers.getContract('RomeTreasury');
  const ClaimHelper = await ethers.getContract('ClaimHelper');
  const Authority = await ethers.getContract('RomeAuthority');

  // Authority
  await Authority.pushVault( Treasury.address, true);

  // aROME
  await aROME.setPresale( Presale.address );
  await aROME.pushPolicy( DAO );

  // ClaimHelper
  await ClaimHelper.setPresale( Presale.address );

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
