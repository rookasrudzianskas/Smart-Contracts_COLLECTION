require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// "ethereum-waffle": "^3.4.0",
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
};
