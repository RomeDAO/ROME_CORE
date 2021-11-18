import {getNamedAccounts,ethers} from 'hardhat';

async function main() {
  const {deployer,DAO,WARCHEST} = await getNamedAccounts();

  const presale = await ethers.getContract('DaiRomePresale');
  const arome = await ethers.getContract('aRome');
  const rome = await ethers.getContract('Rome');

  let signer = await ethers.getSigner(DAO);
  // await rome.connect( signer ).transfer(presale.address,'100000000000000');

  signer = await ethers.getSigner(WARCHEST);
  const amount = '5000000000000'//5000 rome

  // await arome.connect( signer ).approve(presale.address,amount);
  // await presale.connect( signer ).withdraw(amount);
  // let log = await presale.claimable();
  // console.log(log);
  await presale.connect( signer ).claimAlphaRome();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
