import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {WMOVR,MIM,FRAX,SOLARFACTORY} from '../utils/constants';

import {abi} from '../deployments/moonriver/sushiFactory.json';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,WARCHEST} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  let frax,mim,romefrax,feed,solarFactory;

  const rome = await get('Rome');
  const treasury = await get('RomeTreasury');
  const calculator = await get('RomeBondingCalculator');

  // moonriver mainnet
  if (chainId == '1285') {
    solarFactory = await ethers.getContractAt(abi, SOLARFACTORY);

    mim = MIM;
    frax = FRAX;

    // Get LP pair addresses
    romefrax = await solarFactory.callStatic.createPair(rome.address,FRAX);

  // moonbase testnet
  } else if (chainId == '1287') {
    solarFactory = await ethers.getContractAt(abi, '0xf84186b18c2Cc2354ce1aa8A5F9aCd763AA5a096');

    frax = await get('mockFRAX');
    frax = frax.address;

    mim = await get('mockMIM');
    mim = mim.address;

    // Get LP pair addresses
    romefrax = await solarFactory.callStatic.createPair(rome.address,frax);
  } else {
    const factory = await ethers.getContract('mockFactory');

    frax = await get('mockFRAX');
    frax = frax.address;

    mim = await get('mockMIM');
    mim = mim.address;

    // Get LP pair addresses
    romefrax = await factory.callStatic.createPair(rome.address,frax);
  }

  console.log('ROME/FRAX @ ' + romefrax);

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

  // Deploy ROME/FRAX bonds
  await deploy('ROMEFRAXBondDepository', {
    from: deployer,
    args: [rome.address,romefrax,treasury.address,WARCHEST, calculator.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  if (chainId == '1285') {
    const fraxBonds = await get('FRAXBondDepository');

    await hre.run("verify:verify", {
        address: fraxBonds.address,
        constructorArguments: [rome.address,frax,treasury.address,WARCHEST, calculator.address],
    })
    const mimBonds = await get('MIMBondDepository');

    await hre.run("verify:verify", {
        address: mimBonds.address,
        constructorArguments: [rome.address,mim,treasury.address,WARCHEST, calculator.address],
    })
    const romefraxBonds = await get('ROMEFRAXBondDepository');

    await hre.run("verify:verify", {
        address: romefraxBonds.address,
        constructorArguments: [rome.address,romefrax,treasury.address,WARCHEST, calculator.address],
    })
  }
};
export default func;
func.tags = ['Bonds'];
func.dependencies = ['Rome','RomeTreasury','RomeBondingCalculator','Mocks'];
