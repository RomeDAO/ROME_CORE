import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();
  const chainId = await hre.getChainId();

  const rome = await get('Rome');

  await deploy('RomeBondingCalculator', {
    from: deployer,
    args: [rome.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const calculator = await get('RomeBondingCalculator');

  // if (chainId == '1285') {
  //   await hre.run("verify:verify", {
  //       address: calculator.address,
  //       constructorArguments: [rome.address]
  //   })
  // }
};
export default func;
func.tags = ['RomeBondingCalculator'];
func.dependencies = ['Rome'];
