import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();

  const rome = await get('Rome');

  await deploy('RomeBondingCalculator', {
    from: deployer,
    log: true,
    args: [rome.address],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
};
export default func;
func.tags = ['RomeBondingCalculator'];
func.dependencies = ['Rome'];
