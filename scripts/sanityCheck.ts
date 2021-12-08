import {ethers,getNamedAccounts} from 'hardhat';

async function main() {
  const {deployer,OPS} = await getNamedAccounts();

  let log;

  // Init Treasury Check
  const Treasury = await ethers.getContract('RomeTreasury');
  const Authority = await ethers.getContract('RomeAuthority');

  const vault = await Authority.vault();
  if (vault == Treasury.address) {
    log = true;
  } else {
    log = false;
  }
  console.log("Authority Vault Set:", log);

  // Check Authority.vault is Treasury
  // Check Authority.Govenor is DAO
  // Check if Authority policy is pushed


  // Check sRome staking Address is set
  // Check sRome index is set
  // Check if sRome policy is pushed

  // Check staking has distributor contract set
  // Check staking has warmup contract set
  // Check warmup is 0
  // check staking is policy pushed

  // Check distributor has staking address
  // Check distributor has initial reward rate
  // Check Distributor policy is pushed

  // Check Frax is reserve token
  // Check FraxBonds are reserve Depsositor
  // Check Mim is reserve token
  // Check MimBonds are reserve Depsositor
  // Check RomeFrax is liquidity token
  // Check bondingCalculator is set for RomeFrax
  // Check RomeFraxBonds are Liquidity Depsositor

  // Check Mim policy is pushed
  // Check Frax policy is pushed
  // Check RomeFrax policy is pushed
  // Check Treasury policy is pushed
  // Check Rome policy is pushed
  // Check RedeemHelper policy is pushed

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
