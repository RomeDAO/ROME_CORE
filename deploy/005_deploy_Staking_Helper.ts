import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');

  const staking = await get('RomeStaking');

  await deploy('StakingHelper', {
    from: deployer,
    args: [staking.address,rome.address], // 1 Day timelock
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

};
export default func;
func.tags = ['StakingHelper'];
func.dependencies = ['Rome','RomeStaking'];
