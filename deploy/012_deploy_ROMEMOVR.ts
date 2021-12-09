import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {
  ROME,
  TREASURY,
  CALCULATOR,
  WMOVR,
  ROMEWMOVR,
  WMOVRFEED,
  zeroAddress
} from '../utils/constants';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer,DAO} = await hre.getNamedAccounts();
  const {deploy,get} = hre.deployments;

  console.log('ROME/WMOVR @ ' + ROMEWMOVR);
  console.log('WMOVR @ ' + WMOVR);
  console.log('WMOVR Price Feed @ ' + WMOVRFEED);
  console.log('ROME @ ' + ROME);
  console.log('TREASURY @ ' + TREASURY);
  console.log('CALCULATOR @ ' + CALCULATOR);

  await delay(60000); // Time to check correct addresses

  // Deploy ROME/FRAX bonds
  await deploy('ROMEMOVRBondDepository', {
    from: deployer,
    args: [ ROME , ROMEWMOVR , TREASURY , DAO , CALCULATOR, WMOVRFEED ],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const bond = await get('ROMEMOVRBondDepository');


  await hre.run("verify:verify", {
      address: bond.address,
      constructorArguments: [ ROME , ROMEWMOVR , TREASURY , DAO , CALCULATOR, WMOVRFEED ],
  })

};
export default func;
func.tags = ['ROMEWMOVRBond'];
