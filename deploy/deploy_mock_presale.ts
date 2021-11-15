import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,DAO,WARCHEST} = await hre.getNamedAccounts();
  const {deploy,get} = hre.deployments;

  const rome = await ethers.getContract('Rome');

  const arome = await ethers.getContract('aRome');

  const dai = await get('mockDAI');

  const frax = await get('mockFRAX');

  const auth = await ethers.getContract('RomeAuthority');

  await auth.pushVault(deployer,true);

  await deploy('DaiRomePresale', {
    from: deployer,
    args: [arome.address, rome.address, dai.address, frax.address, DAO, WARCHEST, deployer],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const DaiPresale = await ethers.getContract('DaiRomePresale');

  await arome.setPresale(DaiPresale.address);
};
export default func;
func.tags = ['mockClaimHelper','mockDaiRomePresale','mockPRESALE'];
func.dependencies = ['aRome', 'Mocks'];
