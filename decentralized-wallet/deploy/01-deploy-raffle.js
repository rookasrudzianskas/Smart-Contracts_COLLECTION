const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const {deploy, log} = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
}
