import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {epochLength, firstEpochBlock, firstEpochNumber} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const srome = await get('sRome');

  await deploy('RomeStaking', {
    from: deployer,
    args: [rome.address, srome.address, epochLength, firstEpochNumber, firstEpochBlock],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

};
export default func;
func.tags = ['RomeStaking'];
func.dependencies = ['Rome','sRome'];
