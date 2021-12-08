import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const srome = await get('sRome');
  const staking = await get('RomeStaking');

  await deploy('StakingHelper', {
    from: deployer,
    args: [staking.address,rome.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  await deploy('StakingWarmup', {
    from: deployer,
    args: [staking.address, srome.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const stakingHelper = await get('StakingHelper');

  // if (chainId == '1285') {
  //   await hre.run("verify:verify", {
  //       address: stakingHelper.address,
  //       constructorArguments: [staking.address,rome.address],
  //   })
  //   const stakingWarmup = await get('StakingWarmup');

  //   await hre.run("verify:verify", {
  //       address: stakingWarmup.address,
  //       constructorArguments: [staking.address, srome.address],
  //   })
  // }
};
export default func;
func.tags = ['StakingHelper','StakingWarmup','STAKING'];
func.dependencies = ['Rome', 'sRome','RomeStaking'];
