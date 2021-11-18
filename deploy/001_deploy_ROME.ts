import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {zeroAddress} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const chainId = await hre.getChainId();
  const {deploy,get} = deployments;

  const {deployer,DAO,OPS} = await getNamedAccounts();

  await deploy('RomeAuthority', {
    from: deployer,
    args: [deployer,DAO,OPS,zeroAddress],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
  const authority = await get('RomeAuthority');

  await deploy('Rome', {
    from: deployer,
    args: [authority.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
  const Rome = await get('Rome');

  // if (chainId == '1285') {
  //   await hre.run("verify:verify", {
  //       address: authority.address,
  //       constructorArguments: [deployer,DAO,OPS,zeroAddress],
  //   })
  //   await hre.run("verify:verify", {
  //       address: Rome.address,
  //       constructorArguments: [authority.address],
  //   })
  // }
};
export default func;
func.tags = ['Rome'];
