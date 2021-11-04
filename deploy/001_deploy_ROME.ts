import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('Rome', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
  const Rome = await get('Rome');
  await hre.run("verify:verify", {
      address: Rome.address,
  })
};
export default func;
func.tags = ['Rome'];
