import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,DAO} = await hre.getNamedAccounts();
  const {deploy,get} = hre.deployments;

  const rome = await ethers.getContract('Rome');

  const arome = await ethers.getContract('aRome');

  const dai = await get('mockDAI');

  const frax = await get('mockFRAX');

  const auth = await ethers.getContract('RomeAuthority');

  await deploy('mockPresale', {
    from: deployer,
    args: [arome.address, rome.address, dai.address, frax.address, DAO, deployer],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const DaiPresale = await ethers.getContract('mockPresale');

  await delay(1000);

  await auth.pushVault(deployer,true);

  await arome.setPresale(DaiPresale.address);
};
export default func;
func.tags = ['mockPresale'];
func.dependencies = ['aRome', 'Mocks','Rome'];
