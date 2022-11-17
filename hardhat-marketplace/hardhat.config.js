require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
    `${process.env.MAINNET_RPC_URL}` ||
    `${process.env.ALCHEMY_MAINNET_RPC_URL}`; // Alchemy
const GOERLI_RPC_URL = `${process.env.GOERLI_RPC_URL}`; // Infura
const POLYGON_MAINNET_RPC_URL = `${process.env.POLYGON_MAINNET_RPC_URL}`;
const PRIVATE_KEY = `${process.env.PRIVATE_KEY}`;
// optional
const MNEMONIC = `${process.env.MNEMONIC}`;

const ETHERSCAN_API_KEY = `${process.env.ETHERSCAN_API_KEY}`;
const POLYGONSCAN_API_KEY = `${process.env.POLYGONSCAN_API_KEY}`;
const REPORT_GAS = process.env.REPORT_GAS ? true : false;

if(!PRIVATE_KEY || !MNEMONIC || !ETHERSCAN_API_KEY || !POLYGONSCAN_API_KEY || !MAINNET_RPC_URL || !GOERLI_RPC_URL || !POLYGON_MAINNET_RPC_URL ) return;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      saveDeployments: true,
      chainId: 5,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      saveDeployments: true,
      chainId: 1,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 137,
    },
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  contractSizer: {
    runOnCompile: false,
    only: ["NftMarketplace"],
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.8.13",
      }
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
}
