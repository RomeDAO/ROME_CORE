import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {FRAX, MIM, DAI, WMOVR, SOLARFACTORY, SUSHIFACTORY} from '../utils/constants';

import {abi} from '../deployments/moonriver/sushiFactory.json';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  let rome, frax, mim, dai, romewmovr, romemim, romefrax, solarFactory, sushiFactory, wmovr;

  // moonriver mainnet
  if (chainId == '1285') {

    rome = await get('Rome');

    frax = FRAX;

    dai = DAI;

    mim = MIM;

    wmovr = WMOVR;

    solarFactory = await ethers.getContractAt(abi, SOLARFACTORY);

    sushiFactory = await ethers.getContractAt(abi, SUSHIFACTORY);

    romewmovr = await solarFactory.callStatic.createPair(rome.address,WMOVR);
    romefrax = await sushiFactory.callStatic.createPair(rome.address,FRAX);
    romemim = await solarFactory.callStatic.createPair(rome.address,MIM);

    // moonbase alpha testnet
  } else if (chainId == '1287') {

    rome = await get("Rome");

    frax = await get('mockFRAX');
    frax = frax.address;

    dai = await get('mockDAI');
    dai = dai.address;

    mim = await get('mockMIM');
    mim = mim.address;

    wmovr = await get('mockWMOVR');
    wmovr = wmovr.address;

    solarFactory = await ethers.getContractAt(abi,'0xf84186b18c2Cc2354ce1aa8A5F9aCd763AA5a096');

    sushiFactory = await ethers.getContractAt(abi, SUSHIFACTORY);

    romewmovr = await solarFactory.callStatic.createPair(rome.address,wmovr);
    romefrax = await sushiFactory.callStatic.createPair(rome.address,frax);
    romemim = await solarFactory.callStatic.createPair(rome.address,mim);

  } else {

    rome = await get("Rome");

    frax = await get('mockFRAX');
    frax = frax.address;

    dai = await get('mockDAI');
    dai = dai.address;

    mim = await get('mockMIM');
    mim = mim.address;

    wmovr = await get('mockWMOVR');
    wmovr = wmovr.address;

    const factory = await ethers.getContract('mockFactory');

    romewmovr = await factory.callStatic.createPair(rome.address,wmovr);
    romefrax = await factory.callStatic.createPair(rome.address,frax);
    romemim = await factory.callStatic.createPair(rome.address,mim);
  }

  const calculator = await get('RomeBondingCalculator');

  console.log('ROME/WMOVR @ ' + romewmovr);
  console.log('ROME/MIM @ ' + romemim);
  console.log('ROME/FRAX @ ' + romefrax);

  await deploy('RomeTreasury', {
    from: deployer,
    args: [rome.address, dai, mim, frax, wmovr, romemim, romefrax, romewmovr, calculator.address, '6400'], // 1 Day timelock
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
};
export default func;
func.tags = ['RomeTreasury'];
func.dependencies = ['Rome','RomeBondingCalculator','Mocks'];
