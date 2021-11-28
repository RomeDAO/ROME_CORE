import {getNamedAccounts, ethers} from 'hardhat';
import {zeroAddress} from '../utils/constants';

// this script mints rome tokens and transfers them to the presale contract so users can try to claim them
async function main() {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const rome = await ethers.getContract('Rome');
  const staking = await ethers.getContract('RomeStaking');
  const authority = await ethers.getContract('RomeAuthority');
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

  const daiApprove = await dai.connect(addr1).approve(treasury.address, ethers.utils.parseEther('1000000'));
  await daiApprove.wait();

  // deposit treasury
  const depositTx = await treasury
    .connect(addr1)
    .deposit(ethers.utils.parseEther('1000000'), dai.address, ethers.utils.parseUnits('500000', 9));
  await depositTx.wait();

  // end sale
  const endTx = await presale.end();
  await endTx.wait();

  const transferTx = await rome.connect(addr1).transfer(presale.address, 1000000000000);
  await transferTx.wait();

  const transferTx2 = await rome.connect(addr1).transfer(staking.address, 1000000000000);
  await transferTx2.wait();

  // ready the presale contract
  const unlockTx = await presale.claimUnlock();
  await unlockTx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
