import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {zeroAddress} from '../utils/constants';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();

  const Dai = await ethers.getContract('mockDAI');
  const Frax = await ethers.getContract('mockFRAX');
  const Presale = await ethers.getContract('mockPresale');
  const arome = await ethers.getContract('aRome');

  const addr = '0xd7d9bce78aCeAd3EB9199097C0dB6F03A1f3082A';
  const amount = '100000000000000000000000'

  // await Dai.mint('0x9e5bA8cc3b391202Ddae6Edb7ca1D4D8d3763235',amount);
  // await Dai.mint('0xe8777d765fd496ab2df8633859716731f9b3e3a2',amount);
  // await Dai.mint('0x465850345Eb4E63547f8E504dB0947F41F37Be8a',amount);
  // await Dai.mint('0xf97328059376a17d08B5ad419C462590e05958ba',amount);
  // await Dai.mint('0xAB9038948260213E1024818E5a5E27ae07cD71cf',amount);
  // await Dai.mint('0xF6AE3CE747806163766FA1f1782ecaAc05BEf91E',amount);
  // await Dai.mint('0xE83DE5f85AA5E7e877E4DD52F9826D254203f928',amount);
  // await Dai.mint('0xFFEa7f08296397Fef95A69421B5DDCA671f1c2ED',amount);
  // await Dai.mint('0xED1FA7212eD65F3aa4d9D7A5801916159766857d',amount);
  // await Dai.mint('0x36BC0b0D2924e1bf0895A0adE9f39d29C160828f',amount);
  // await Dai.mint('0xb837719672f47578df875095e9a710c24c91a0a9',amount);

  // await Frax.mint('0xBc2B315D65C909C9B80DDfC7573bAc74ef41Ac5c',amount);

  const arr = [
  '0xE83DE5f85AA5E7e877E4DD52F9826D254203f928',
  '0x9e5bA8cc3b391202Ddae6Edb7ca1D4D8d3763235',
  '0xe8777d765fd496ab2df8633859716731f9b3e3a2',
  '0x465850345Eb4E63547f8E504dB0947F41F37Be8a',
  '0xf97328059376a17d08B5ad419C462590e05958ba',
  '0xAB9038948260213E1024818E5a5E27ae07cD71cf',
  '0xF6AE3CE747806163766FA1f1782ecaAc05BEf91E',
  '0xFFEa7f08296397Fef95A69421B5DDCA671f1c2ED',
  '0xED1FA7212eD65F3aa4d9D7A5801916159766857d',
  '0x36BC0b0D2924e1bf0895A0adE9f39d29C160828f',
  '0xb837719672f47578df875095e9a710c24c91a0a9'
  ]

  // await Presale.addMultipleWhitelist(arr);
  // await Presale.addTeam('0xBc2B315D65C909C9B80DDfC7573bAc74ef41Ac5c','10');
  // await Presale.start();
  // await Frax.approve(Presale.address,'100000000000000000000000000');
  //await Presale.depositTeam('1500000000000000000000');
  // await arome.setPresale(Presale.address);
  const log = await Presale.whitelisted('0xf3b0f922d8d3fdafD37C564C3F9728F2E9966538');
  console.log(log);

  // const log2 = await arome.presale();
  // console.log(log2);

};
export default func;
func.tags = ['MINT'];
