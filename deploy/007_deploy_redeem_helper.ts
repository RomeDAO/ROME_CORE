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

  await hre.run("verify:verify", {
      address: redeemHelper.address,
  })

  const FraxBonds = await get('FRAXBondDepository');
  await redeemHelper.addBondContract(FraxBonds.address);

  const MimBonds = await get('MIMBondDepository');
  await redeemHelper.addBondContract(MimBonds.address);

  const RomeFraxBonds = await get('ROMEFRAXBondDepository');
  await redeemHelper.addBondContract(RomeFraxBonds.address);

  if (chainId == '1285' || chainId == '1287') {
    const MovrBonds = await get('MOVRBondDepository');
    await redeemHelper.addBondContract(MovrBonds.address);
  }
};
export default func;
func.tags = ['RedeemHelper','BONDS'];
func.dependencies = ['Bonds'];
