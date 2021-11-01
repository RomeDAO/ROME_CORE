import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const treasury = await get('RomeTreasury');

  const epochLength = '2200';
  const nextEpochBlock = '0';

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
