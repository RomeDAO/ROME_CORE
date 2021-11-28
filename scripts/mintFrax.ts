import {getNamedAccounts, ethers} from 'hardhat';

async function main() {
  const mintTx = await frax.mint(owner, amount);
  await mintTx.wait();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
