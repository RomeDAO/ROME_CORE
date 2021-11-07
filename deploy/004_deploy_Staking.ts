import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {epochLength, firstEpochBlock, firstEpochNumber} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const srome = await get('sRome');

  await deploy('RomeStaking', {
    from: deployer,
    args: [rome.address, srome.address, epochLength, firstEpochNumber, firstEpochBlock],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const romeStaking = await get('RomeStaking');

  if (chainId == '1285') {
    await hre.run("verify:verify", {
        address: romeStaking.address,
        constructorArguments: [rome.address, srome.address, epochLength, firstEpochNumber, firstEpochBlock],
    })
  }
};
export default func;
func.tags = ['RomeStaking'];
func.dependencies = ['Rome','sRome'];
