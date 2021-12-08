import {getNamedAccounts,ethers} from 'hardhat';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const {DAO} = await getNamedAccounts();

  // get contracts
  const aROME = await ethers.getContract('aRome');
  const Presale = await ethers.getContract('DaiRomePresale');

  // aROME
  console.log('aRome.SetPresale()');
  await aROME.setPresale( Presale.address );
  console.log('txSent');
  await delay(15000);
  console.log('aRome.pushPolicy()');
  await aROME.pushPolicy( DAO );
  console.log('txSent');

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
