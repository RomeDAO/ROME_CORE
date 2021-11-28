import {getNamedAccounts,ethers} from 'hardhat';
import {zeroAddress} from '../../utils/constants';

async function main() {
  const {deployer,DAO,WARCHEST} = await getNamedAccounts();

  const frax = await ethers.getContract('mockFRAX');
  const treasury = await ethers.getContract('RomeTreasury');
  const distributor = await ethers.getContract('Distributor');

  const amount = '3000000000000000000000000' // 3mil

  await frax.mint(deployer,amount);

  const signer = await ethers.getSigner(deployer);

  // const queueTx = await treasury.queue('8',distributor.address);
  // queueTx.wait()

  // const toggleTx = await treasury.toggle('8',distributor.address,zeroAddress);
  // toggleTx.wait()

  const rewardManager = await treasury.isRewardManager(distributor.address)
  console.log("reward Manager", rewardManager)

  // console.log(deployer)

  // const val = await treasury.isReserveToken(frax.address)
  // console.log("RESERVE TOKENS ", val)

  // const depositor = await treasury.isReserveDepositor(deployer)
  // console.log("DEPOSITOR ", depositor)

  await frax.connect( signer ).approve(treasury.address,amount);
  await treasury.connect( signer ).deposit(amount, frax.address, (Number(amount) / 1e9).toString());
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
