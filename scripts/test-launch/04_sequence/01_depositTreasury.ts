import {ethers} from 'hardhat';
import {zeroAddress} from '../../../utils/constants';

// this script mints rome tokens and transfers them to the presale contract so users can try to claim them
async function main() {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const treasury = await ethers.getContract('RomeTreasury');
  const dai = await ethers.getContract('mockDAI');
  const rome = await ethers.getContract('Rome');
  const presale = await ethers.getContract('DaiRomePresale');
  const staking = await ethers.getContract('RomeStaking');

  // mint some dai
  console.log('minting dai');
  const daiMint = await dai.mint(addr1.address, ethers.utils.parseEther('1000000'));
  await daiMint.wait();

  console.log('doing some treasury stuff');
  const tQ = await treasury.queue('0', addr1.address);
  await tQ.wait();

  // toggle treasury
  console.log('toggling treasury');
  const treasuryToggle = await treasury.toggle('0', addr1.address, zeroAddress);
  await treasuryToggle.wait();

  console.log('approving dai');
  // depositing into treasury mints rome which we need for claiming
  const daiApprove = await dai.connect(addr1).approve(treasury.address, ethers.utils.parseEther('1000000'));
  await daiApprove.wait();

  console.log('depositing into treasury');
  // deposit treasury
  const depositTx = await treasury
    .connect(addr1)
    .deposit(ethers.utils.parseEther('1000000'), dai.address, ethers.utils.parseUnits('500000', 9));
  await depositTx.wait();

  console.log('send rome');
  // transfer
  const transferTx = await rome.connect(addr1).transfer(presale.address, 100000000000000);
  await transferTx.wait();

  //   const transferTx2 = await rome.connect(addr1).transfer(staking.address, 100000000000000);
  //   await transferTx2.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
