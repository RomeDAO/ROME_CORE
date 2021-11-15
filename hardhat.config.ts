import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import {node_url, accounts, getChainId, apiKey} from './utils/network';

// While waiting for hardhat PR: https://github.com/nomiclabs/hardhat/pull/1542
if (process.env.HARDHAT_FORK) {
  process.env['HARDHAT_DEPLOY_FORK'] = process.env.HARDHAT_FORK;
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
    {
      version: '0.6.12',
      settings: {
        optimizer: {
          enabled: true,
          runs: 9999,
        }
      }
    },
    {
      version:'0.7.5',
      settings: {
        optimizer: {
          enabled: true,
          runs: 9999,
        }
      }
    },
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    dev: 1,
    DAO: {
      default: 2,
      // Moonriver
      1285: '0xD4a7FEbD52efda82d6f8acE24908aE0aa5b4f956',
    },
    OPS: {
      default: 3,
      // Moonriver
      1285: '0x37BA0A3a0Fd8a190a8D661bB681454e01A937A62',
    },
    WARCHEST: {
      default: 4,
      // Moonriver
      1285: '0xc0D66988b67f1EA0F27BEAB7ca1DC7c142D76EA9',
    }
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
      // process.env.HARDHAT_FORK will specify the network that the fork is made from.
      // this line ensure the use of the corresponding accounts
      accounts: accounts(process.env.HARDHAT_FORK),
      forking: process.env.HARDHAT_FORK
        ? {
            // TODO once PR merged : network: process.env.HARDHAT_FORK,
            url: node_url(process.env.HARDHAT_FORK),
            blockNumber: process.env.HARDHAT_FORK_NUMBER ? parseInt(process.env.HARDHAT_FORK_NUMBER) : undefined,
          }
        : undefined,
      mining: process.env.MINING_INTERVAL
        ? {
            auto: false,
            interval: process.env.MINING_INTERVAL.split(',').map((v) => parseInt(v)) as [number, number],
          }
        : undefined,
    },
    localhost: {
      url: node_url('localhost'),
      accounts: accounts(),
    },
    staging: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
    production: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
    kovan: {
      url: node_url('kovan'),
      accounts: accounts('kovan'),
    },
    goerli: {
      url: node_url('goerli'),
      accounts: accounts('goerli'),
    },
    moonriver: {
      url: node_url('moonriver'),
      chainId: getChainId('moonriver'),
      accounts: accounts('moonriver'),
      live: true,
      saveDeployments: true,
      tags: ['moonriver'],
      gasPrice: 1000000000,
      gas: 8000000,
    },
    moonbase: {
      url: node_url('moonbase'),
      chainId: getChainId('moonbase'),
      accounts: accounts('moonbase'),
      live: true,
      saveDeployments: true,
      tags: ['moonbase'],
      gasPrice: 1000000000,
      gas: 8000000,
    }
  },
  paths: {
    sources: 'src',
  },
  etherscan : {
    // Your API key for Etherscan
    // Obtain one at httpsL//etherscan.io/
    apiKey: apiKey('moonriver')
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
  },
  external: process.env.HARDHAT_FORK
    ? {
        deployments: {
          // process.env.HARDHAT_FORK will specify the network that the fork is made from.
          // these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
          hardhat: ['deployments/' + process.env.HARDHAT_FORK],
          localhost: ['deployments/' + process.env.HARDHAT_FORK],
        },
      }
    : undefined,
};

export default config;
