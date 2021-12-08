import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const chainId = await hre.getChainId();
  const {deploy,get} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('RedeemHelper', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const redeemHelper = await ethers.getContract('RedeemHelper');

//   if (chainId == '1285') {
//     await hre.run("verify:verify", {
//         address: redeemHelper.address,
//     })
//   }
};
export default func;
func.tags = ['RedeemHelper','BONDS'];
func.dependencies = ['Bonds'];
