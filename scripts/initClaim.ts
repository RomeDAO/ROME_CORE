import {getNamedAccounts, ethers} from 'hardhat';
import {zeroAddress} from '../utils/constants';

// this script mints rome tokens and transfers them to the presale contract so users can try to claim them
async function main() {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const rome = await ethers.getContract('Rome');
  const authority = await ethers.getContract('RomeAuthority');
  const presale = await ethers.getContract('DaiRomePresale');

  // end sale
  const endTx = await presale.end();
  await endTx.wait();

  // let dev mint rome tokens
  const pushTx = await authority.pushVault(addr1.address, true);
  await pushTx.wait();

  const mintTx = await rome.connect(addr1).mint(addr1.address, 1000000000000);
  await mintTx.wait();

  const transferTx = await rome.connect(addr1).transfer(presale.address, 1000000000000);
  await transferTx.wait();

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
