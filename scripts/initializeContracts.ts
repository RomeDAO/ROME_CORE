import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {deployments, getUnnamedAccounts, ethers} from 'hardhat';

async function main(hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy,get} = hre.deployments;

 // sRome

 // Rome

 // Staking

 // Distributor

 // Redeem Helper

 // Dai Bond

 // Mim bond

 // Rome Wmovr bond
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
