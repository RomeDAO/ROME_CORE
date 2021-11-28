import {getNamedAccounts, ethers} from 'hardhat';
import {zeroAddress} from '../utils/constants';

async function main() {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const amount = '3000000000000000000000000'; // 3mil
  // const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  // const {DAO, deployer} = await getNamedAccounts();
  // const signer = await ethers.getSigner(deployer);
  // const treasury = await ethers.getContract('RomeTreasury');
  const frax = await ethers.getContract('mockFRAX');

  // const stakingHelper = await ethers.getContract('StakingHelper');
  // const stakingTx = await stakingHelper.connect(owner).stake('30000000', owner.address);
  // await stakingTx.wait();

  const mintTx = await frax.mint(owner.address, amount);
  await mintTx.wait();

  // console.log('frax', frax.address);

  const fraxBonds = await ethers.getContract('FRAXBondDepository');
  const val = await fraxBonds.staking();
  console.log('val', val);

  //   const queueTx = await treasury.queue('0',deployer);
  //   await queueTx.wait()

  //   const toggleTx = await treasury.toggle('0',deployer,zeroAddress);
  //   await toggleTx.wait()

  // //   const queueTx = await treasury.queue('0',owner);
  // //   await queueTx.wait()

  // //   const toggleTx = await treasury.toggle('0',owner,zeroAddress);
  // //   await toggleTx.wait()

  //   const rewardManager = await treasury.isReserveDepositor(owner)
  //   console.log("Is reward manager", rewardManager)

  //   const reserveToken = await treasury.isReserveToken(frax.address)
  //   console.log("Is reserve token", reserveToken)

  //   //MINT SHITTON ROME
  //   await frax.connect( signer ).approve(treasury.address,amount);
  //   await treasury.connect( signer ).deposit(amount, frax.address, "0");

  //     console.log(owner, "DEPLOYER ")

  //   const RomeFraxBonds = await ethers.getContract('ROMEFRAXBondDepository');
  //   const FraxBonds = await ethers.getContract('FRAXBondDepository');
  //   const MimBonds = await ethers.getContract('MIMBondDepository');

  // //   queue reserve depositor toggle for bonds and DAO
  //   await FraxBonds.standardizedDebtRatio();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
