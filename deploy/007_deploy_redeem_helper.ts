import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const chainId = await hre.getChainId();
  const {deploy, get} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('RedeemHelper', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const redeemHelper = await ethers.getContract('RedeemHelper');

  const FraxBonds = await get('FRAXBondDepository');
  const redeemTx = await redeemHelper.addBondContract(FraxBonds.address);
  await redeemTx.wait();

  const MimBonds = await get('MIMBondDepository');
  const redeemTx1 = await redeemHelper.addBondContract(MimBonds.address);
  await redeemTx1.wait();

  const RomeFraxBonds = await get('ROMEFRAXBondDepository');
  const redeemTx2 = await redeemHelper.addBondContract(RomeFraxBonds.address);
  await redeemTx2.wait();

  if (chainId == '1285' || chainId == '1287') {
    const MovrBonds = await get('MOVRBondDepository');
    const tx = await redeemHelper.addBondContract(MovrBonds.address);
    await tx.wait();
  }

  if (chainId == '1285') {
    await hre.run('verify:verify', {
      address: redeemHelper.address,
    });
  }
};
export default func;
func.tags = ['RedeemHelper', 'BONDS'];
func.dependencies = ['Bonds'];
