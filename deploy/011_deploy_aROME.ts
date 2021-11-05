import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();
  const chainId = await hre.getChainId();

  await deploy('aRome', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const arome = await get('aRome');

  if (chainId == '1285' || chainId == '1287') {
    await hre.run("verify:verify", {
        address: arome.address,
    })
  }

};
export default func;
func.tags = ['aRome'];
