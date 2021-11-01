import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

import {abi} from '../deployments/moonriver/sushiFactory.json';


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  let rome,mim,frax, romewmovr, romemim, romefrax, solarFactory, sushiFactory, wmovr

  // moonriver mainnet
  if (chainId == '1285') {

    rome = await get('Rome');

    frax = '0x1A93B23281CC1CDE4C4741353F3064709A16197d';

    mim = '0x0caE51e1032e8461f4806e26332c030E34De3aDb';

    wmovr = '0x98878B06940aE243284CA214f92Bb71a2b032B8A';

    solarFactory = await ethers.getContractAt(abi,'0x049581aEB6Fe262727f290165C29BDAB065a1B68');

    sushiFactory = await ethers.getContractAt(abi, '0xc35DADB65012eC5796536bD9864eD8773aBc74C4');

    romewmovr = await solarFactory.callStatic.createPair(rome.address,wmovr);
    romefrax = await sushiFactory.callStatic.createPair(rome.address,frax);
    romemim = await solarFactory.callStatic.createPair(rome.address,mim);

    // moonbase alpha testnet
  } else if (chainId == '1287') {

    rome = await get("Rome");

    frax = await get('mockFRAX');
    frax = frax.address;

    mim = await get('mockMIM');
    mim = mim.address;

    wmovr = await get('mockWMOVR');
    wmovr = wmovr.address;

    solarFactory = await ethers.getContractAt(abi,'0xf84186b18c2Cc2354ce1aa8A5F9aCd763AA5a096');

    sushiFactory = await ethers.getContractAt(abi, '0xc35DADB65012eC5796536bD9864eD8773aBc74C4');

    romewmovr = await solarFactory.callStatic.createPair(rome.address,wmovr);
    romefrax = await sushiFactory.callStatic.createPair(rome.address,frax);
    romemim = await solarFactory.callStatic.createPair(rome.address,mim);

  } else {

    rome = await get("Rome");

    frax = await get('mockFRAX');
    frax = frax.address;

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

  await deploy('RomeTreasury', {
    from: deployer,
    args: [rome.address, mim, frax, wmovr, romemim, romefrax, romewmovr, calculator.address, '6400'], // 1 Day timelock
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
export default func;
func.tags = ['RomeTreasury'];
func.dependencies = ['Rome','RomeBondingCalculator'];
