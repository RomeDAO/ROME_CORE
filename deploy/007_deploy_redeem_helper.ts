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

  const FraxBonds = await get('FRAXBondDepository');
  const fraxTx = await redeemHelper.addBondContract(FraxBonds.address);
  await fraxTx.wait()

  const MimBonds = await get('MIMBondDepository');
  const mimTx = await redeemHelper.addBondContract(MimBonds.address);
  await mimTx.wait()

  const RomeFraxBonds = await get('ROMEFRAXBondDepository');
  const romeFraxTx = await redeemHelper.addBondContract(RomeFraxBonds.address);
  await romeFraxTx.wait()

  if (chainId == '1285' || chainId == '1287') {
    const MovrBonds = await get('MOVRBondDepository');
    const movrTx = await redeemHelper.addBondContract(MovrBonds.address);
    await movrTx.wait()
  }

  if (chainId == '1285') {
    await hre.run("verify:verify", {
        address: redeemHelper.address,
    })
  }
};
export default func;
func.tags = ['RedeemHelper','BONDS'];
func.dependencies = ['Bonds'];
