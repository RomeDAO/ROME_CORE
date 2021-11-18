import {getNamedAccounts,ethers} from 'hardhat';
import {zeroAddress} from '../../utils/constants';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const {deployer,DAO,WARCHEST} = await getNamedAccounts();

  const frax = await ethers.getContract('mockFRAX');
  const presale = await ethers.getContract('DaiRomePresale');

  const amount = '300000000000000000000000' // 300k

  const signer = await ethers.getSigner(WARCHEST);

  await frax.connect( signer ).approve(presale.address,amount);
  await delay(15000);
  await presale.connect( signer ).depositTeam(amount);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
