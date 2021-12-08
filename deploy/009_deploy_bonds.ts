import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {
  ROME,
  TREASURY,
  CALCULATOR,
  MIM,
  FRAX,
  ROMEFRAX,
  zeroAddress
} from '../utils/constants';

import {abi} from '../deployments/moonriver/sushiFactory.json';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,DAO} = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const {deploy,get} = hre.deployments;

  console.log('ROME/FRAX @ ' + ROMEFRAX);
  console.log('FRAX @ ' + FRAX);
  console.log('MIM @ ' + MIM);
  console.log('ROME @ ' + ROME);
  console.log('TREASURY @ ' + TREASURY);
  console.log('CALCULATOR @ ' + CALCULATOR);

  // Deploy FRAX bonds
  await deploy('MIMBondDepository', {
    from: deployer,
    args: [ ROME , MIM , TREASURY , DAO , zeroAddress ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  await delay(60000);

  // Deploy ROME/FRAX bonds
  await deploy('ROMEFRAXBondDepository', {
    from: deployer,
    args: [ ROME , ROMEFRAX , TREASURY , DAO , CALCULATOR ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

    const mimBonds = await get('MIMBondDepository');
    await delay(60000);

    await hre.run("verify:verify", {
        address: mimBonds.address,
        constructorArguments: [ ROME , MIM , TREASURY , DAO , zeroAddress ],
    })
    const romefraxBonds = await get('ROMEFRAXBondDepository');
    await delay(60000);

    await hre.run("verify:verify", {
        address: romefraxBonds.address,
        constructorArguments: [ ROME , ROMEFRAX , TREASURY , DAO , CALCULATOR ],
    })

};
export default func;
func.tags = ['Bonds'];
