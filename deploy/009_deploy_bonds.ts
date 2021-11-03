import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {WMOVR,MIM,FRAX,SOLARFACTORY,SUSHIFACTORY} from '../utils/constants';

import {abi} from '../deployments/moonriver/sushiFactory.json';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,WARCHEST} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  let frax,mim,wmovr,romewmovr,romemim,romefrax,feed,solarFactory,sushiFactory;

  const rome = await get('Rome');
  const treasury = await get('RomeTreasury');
  const calculator = await get('RomeBondingCalculator');

  // moonriver mainnet
  if (chainId == '1285') {
    solarFactory = await ethers.getContractAt(abi, SOLARFACTORY);
    sushiFactory = await ethers.getContractAt(abi, SUSHIFACTORY);

    mim = MIM;
    frax = FRAX;
    wmovr = WMOVR;

    // MOVR price feed from chainlink
    feed = '';
    // Get LP pair addresses
    romewmovr = await solarFactory.callStatic.createPair(rome.address,WMOVR);
    romemim = await solarFactory.callStatic.createPair(rome.address,MIM);
    romefrax = await sushiFactory.callStatic.createPair(rome.address,FRAX);

  // moonbase testnet
  } else if (chainId == '1287') {
    solarFactory = await ethers.getContractAt(abi, '0xf84186b18c2Cc2354ce1aa8A5F9aCd763AA5a096');
    sushiFactory = await ethers.getContractAt(abi, SUSHIFACTORY);

    frax = await get('mockFRAX');
    frax = frax.address;

    mim = await get('mockMIM');
    mim = mim.address;

    wmovr = await get('mockWMOVR');
    wmovr = wmovr.address;

    // MOVR price feed from chainlink
    feed = '';
    // Get LP pair addresses
    romewmovr = await solarFactory.callStatic.createPair(rome.address,wmovr);
    romemim = await solarFactory.callStatic.createPair(rome.address,mim);
    romefrax = await sushiFactory.callStatic.createPair(rome.address,frax);
  } else {
    const factory = await ethers.getContract('mockFactory');

    frax = await get('mockFRAX');
    frax = frax.address;

    mim = await get('mockMIM');
    mim = mim.address;

    wmovr = await get('mockWMOVR');
    wmovr = wmovr.address;

    // MOVR price feed from chainlink
    feed = '';
    // Get LP pair addresses
    romewmovr = await factory.callStatic.createPair(rome.address,wmovr);
    romemim = await factory.callStatic.createPair(rome.address,mim);
    romefrax = await factory.callStatic.createPair(rome.address,frax);
  }

  console.log('ROME/WMOVR @ ' + romewmovr);
  console.log('ROME/MIM @ ' + romemim);
  console.log('ROME/FRAX @ ' + romefrax);

  if (chainId == '1285' || chainId == '1287') {
    // Deploy Movr bonds
    await deploy('MOVRBondDepository', {
      from: deployer,
      args: [rome.address,wmovr,treasury.address,WARCHEST, calculator.address, feed],
      log: true,
      autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });

    // Deploy ROME/MOVR bonds
    await deploy('ROMEMOVRBondDepository', {
      from: deployer,
      args: [rome.address,romewmovr,treasury.address,WARCHEST, calculator.address, feed],
      log: true,
      autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });
  }
  // Deploy MIM bonds
  await deploy('MIMBondDepository', {
    from: deployer,
    args: [rome.address,mim,treasury.address,WARCHEST, calculator.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  // Deploy FRAX bonds
  await deploy('FRAXBondDepository', {
    from: deployer,
    args: [rome.address,frax,treasury.address,WARCHEST, calculator.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  // Deploy ROME/MIM bonds
  await deploy('ROMEMIMBondDepository', {
    from: deployer,
    args: [rome.address,romemim,treasury.address,WARCHEST, calculator.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  // Deploy ROME/FRAX bonds
  await deploy('ROMEFRAXBondDepository', {
    from: deployer,
    args: [rome.address,romefrax,treasury.address,WARCHEST, calculator.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });



};
export default func;
func.tags = ['Bonds'];
func.dependencies = ['Rome','RomeTreasury','RomeBondingCalculator','Mocks'];
