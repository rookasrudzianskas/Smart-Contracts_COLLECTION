"use strict";
exports.__esModule = true;
require("@typechain/hardhat");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("dotenv/config");
require("solidity-coverage");
require("hardhat-deploy");
require("solidity-coverage");
var COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
var GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli.alchemyapi.io/v2/your-api-key";
var PRIVATE_KEY = process.env.PRIVATE_KEY || "privatKey";
var ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
var config = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5
        }
    },
    solidity: "0.8.9",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true
    },
    namedAccounts: {
        deployer: {
            "default": 0,
            1: 0
        }
    },
    mocha: {
        timeout: 200000
    }
};
exports["default"] = config;
//# sourceMappingURL=hardhat.config.js.map