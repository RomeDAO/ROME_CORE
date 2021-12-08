import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const chainId = await hre.getChainId();
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('sRome', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const srome = await get('sRome');

  // if (chainId == '1285') {
  //   await hre.run("verify:verify", {
  //       address: srome.address,
  //   })
  // }
};
export default func;
func.tags = ['sRome'];
