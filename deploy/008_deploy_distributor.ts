import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {epochLength, nextEpochBlock} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const srome = await get('sRome');
  const treasury = await get('RomeTreasury');
  const staking = await get('RomeStaking');

  await deploy('Distributor', {
    from: deployer,
    args: [treasury.address,rome.address,epochLength,nextEpochBlock],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const distibutor = await get('Distributor');

  if (chainId == '1285' || chainId == '1287') {
    await hre.run("verify:verify", {
        address: distibutor.address,
        constructorArguments: [staking.address, srome.address],
    })
  }
};
export default func;
func.tags = ['Distributor','STAKING'];
func.dependencies = ['Rome','RomeTreasury'];
