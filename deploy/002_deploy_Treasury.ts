import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {FRAX, MIM, DAI} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,DAO} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  let rome, frax, mim, dai, romefrax, solarFactory;

  // moonriver mainnet
  if (chainId == '1285') {

    rome = await get('Rome');

    frax = FRAX;

    dai = DAI;

    mim = MIM;

    solarFactory = await ethers.getContract("SolarFactory");

    romefrax = await solarFactory.callStatic.createPair(rome.address,FRAX);

    // moonbase alpha testnet
  } else if (chainId == '1287') {

    rome = await get("Rome");

    frax = await get('mockFRAX');
    frax = frax.address;

    dai = await get('mockDAI');
    dai = dai.address;

    mim = await get('mockMIM');
    mim = mim.address;

    const sushiFactory = await ethers.getContract("UniswapV2Factory");

    romefrax = await sushiFactory.callStatic.createPair(rome.address,frax);


  } else {

    rome = await get("Rome");

    frax = await get('mockFRAX');
    frax = frax.address;

    dai = await get('mockDAI');
    dai = dai.address;

    mim = await get('mockMIM');
    mim = mim.address;

    const factory = await ethers.getContract('mockFactory');

    romefrax = await factory.callStatic.createPair(rome.address,frax);
  }

  const calculator = await get('RomeBondingCalculator');

  console.log('ROME/FRAX @ ' + romefrax);

  await deploy('RomeTreasury', {
    from: deployer,
    args: [rome.address, dai, mim, frax, romefrax, calculator.address, DAO, '1000'], // roughly 4hours
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const Treasury = await ethers.getContract('RomeTreasury');

  // if (chainId == '1285') {
  //   await hre.run("verify:verify", {
  //       address: Treasury.address,
  //       constructorArguments: [rome.address, dai, mim, frax, romefrax, calculator.address, DAO, '1000'],
  //   })
  // }
};
export default func;
func.tags = ['RomeTreasury','TREASURY'];
func.dependencies = ['Rome','RomeBondingCalculator','Mocks'];
