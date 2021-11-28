import {ethers} from 'hardhat';

async function main() {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  const aROME = await ethers.getContract('aRome');

  // get contracts
  console.log('aRome.SetPresale()');

  // need to set this to mint aROME
  await aROME.setPresale(owner.address);

  const addresses = [owner.address, addr1.address];

  // mint aROME for everyone
  for (const address of addresses) {
    const mintTx = await aROME.mint(address, ethers.utils.parseUnits('75', 9));
    await mintTx.wait();
    console.log('minted aROME for ' + address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
