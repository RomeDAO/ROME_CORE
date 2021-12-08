import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {epochLength, firstBlockOffset,firstEpochBlock} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const srome = await get('sRome');
  const treasury = await get('RomeTreasury');
  const staking = await get('RomeStaking');

  // const firstEpochBlock = await hre.ethers.provider.getBlockNumber() + firstBlockOffset;

  await deploy('Distributor', {
    from: deployer,
    args: [treasury.address,rome.address,epochLength,'993734'],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const distibutor = await get('Distributor');

  // if (chainId == '1285') {
  //   await hre.run("verify:verify", {
  //       address: distibutor.address,
  //       constructorArguments: [treasury.address,rome.address,epochLength,'993734'],
  //   })
  // }
};
export default func;
func.tags = ['Distributor','STAKING'];
func.dependencies = ['Rome','RomeTreasury'];
