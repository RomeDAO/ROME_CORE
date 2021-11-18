import {getNamedAccounts,ethers} from 'hardhat';
import {zeroAddress} from '../utils/constants';

async function main() {
  const {deployer} = await getNamedAccounts();

  const signer = await ethers.getSigner(deployer);

  await signer.sendTransaction({
    to: '0xBc2B315D65C909C9B80DDfC7573bAc74ef41Ac5c',
    value: ethers.utils.parseEther("0.001")
  })
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
