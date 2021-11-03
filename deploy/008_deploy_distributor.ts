import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {epochLength, nextEpochBlock} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const treasury = await get('RomeTreasury');

  await deploy('Distributor', {
    from: deployer,
    args: [treasury.address,rome.address,epochLength,nextEpochBlock],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

};
export default func;
func.tags = ['Distributor'];
func.dependencies = ['Rome','RomeTreasury'];
