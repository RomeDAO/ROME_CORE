import {getNamedAccounts,ethers} from 'hardhat';
import {abi} from '../../deployments/moonbase/UniswapV2Router02.json';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const {deployer,DAO} = await getNamedAccounts();

  const presale = await ethers.getContract('DaiRomePresale');
  const frax = await ethers.getContract('mockFRAX');
  const treasury = await ethers.getContract('RomeTreasury');
  const rome = await ethers.getContract('Rome');
  const claimHelper = await ethers.getContract('ClaimHelper');
  const sushiRouter = await ethers.getContractAt(abi,'0xc35DADB65012eC5796536bD9864eD8773aBc74C4');

  const signer = await ethers.getSigner( DAO );

  console.log('approving rome...');
  await rome.connect( signer ).approve(claimHelper.address,'5000000000000');
  await delay(10000);
  console.log('approving frax...');
  await frax.connect( signer ).approve(claimHelper.address,'500000000000000000000000');
  await delay(10000);
  console.log('claiming...')
  await claimHelper.connect( signer ).Claim(
    '5000000000000', // 5000 ROME
    '0', // 500k Frax
    '4500000000000', // 4500 ROME
    '0', // 450k Frax
    sushiRouter.address,
    frax.address
    );

  // const log = await claimHelper.DAI_PRESALE();
  // console.log(log);

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
