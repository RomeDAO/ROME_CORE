import {ethers} from 'hardhat';

// this script mints rome tokens and transfers them to the presale contract so users can try to claim them
async function main() {
  const mimBond = await ethers.getContract('MIMBondDepository');
  const fraxBond = await ethers.getContract('FRAXBondDepository');
  const mim = await ethers.getContract('mockMIM');
  const frax = await ethers.getContract('mockFRAX');
  const dai = await ethers.getContract('mockDAI');

  //   const factory = await ethers.getContract('Uni');

  console.log('fraxBond', fraxBond.address);
  console.log('mimBond', mimBond.address);
  console.log('frax', frax.address);
  console.log('mim', mim.address);

  console.log('dai total', ethers.utils.formatEther(await dai.totalSupply()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
