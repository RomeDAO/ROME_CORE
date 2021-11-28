import {getNamedAccounts, ethers} from 'hardhat';
import {zeroAddress} from '../../../utils/constants';

// this script mints rome tokens and transfers them to the presale contract so users can try to claim them
async function main() {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const treasury = await ethers.getContract('RomeTreasury');
  const presale = await ethers.getContract('DaiRomePresale');
  const dai = await ethers.getContract('mockDAI');

  // mint some dai
  const daiMint = await dai.mint(addr1.address, ethers.utils.parseEther('1000000'));
  await daiMint.wait();

  const tQ = await treasury.queue('0', addr1.address);
  await tQ.wait();

  // toggle treasury
  const treasuryToggle = await treasury.toggle('0', addr1.address, zeroAddress);
  await treasuryToggle.wait();

  // depositing into treasury mints rome which we need for claiming
  const daiApprove = await dai.connect(addr1).approve(treasury.address, ethers.utils.parseEther('1000000'));
  await daiApprove.wait();

  // deposit treasury
  const depositTx = await treasury
    .connect(addr1)
    .deposit(ethers.utils.parseEther('1000000'), dai.address, ethers.utils.parseUnits('500000', 9));
  await depositTx.wait();

  // end sale
  console.log('end presale');
  const endTx = await presale.end();
  await endTx.wait();

  // ready the presale contract
  console.log('unlocking claim on presale');
  const unlockTx = await presale.claimUnlock();
  await unlockTx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
