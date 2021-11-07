import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {DAI,FRAX} from '../utils/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,DAO,WARCHEST} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  const rome = await get('Rome');
  const arome = await get('aRome');

  let dai,frax;

  // moonriver mainnet
  if (chainId == '1285') {
    dai = DAI;
    frax = FRAX;
  } else {
    const Dai = await get('mockDAI');
    dai = Dai.address;
    const Frax = await get('mockFRAX');
    frax = Frax.address;
  }
  await deploy('ClaimHelper', {
    from: deployer,
    args: [rome.address,DAO],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const claimHelper = await ethers.getContract('ClaimHelper');

  await deploy('DaiRomePresale', {
    from: deployer,
    args: [arome.address, rome.address, dai, frax, DAO, WARCHEST, claimHelper.address],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const DaiPresale = await ethers.getContract('DaiRomePresale');

  console.log('ClaimHelper Address: ' + claimHelper.address)

  console.log('DAI Presale Address: ' + DaiPresale.address)
  await claimHelper.setPresale(DaiPresale.address);
  await claimHelper.transferOwnership( DAO );

  if (chainId == '1285') {
    await hre.run("verify:verify", {
        address: claimHelper.address,
        constructorArguments: [rome.address,DAO],
    })

    const presale = await get('DaiRomePresale');

    await hre.run("verify:verify", {
        address: presale.address,
        constructorArguments: [arome.address, rome.address, dai, DAO, WARCHEST, claimHelper.address],
    })
  }

};
export default func;
func.tags = ['ClaimHelper','DaiRomePresale','PRESALE'];
func.dependencies = ['Rome', 'aRome', 'Mocks'];
