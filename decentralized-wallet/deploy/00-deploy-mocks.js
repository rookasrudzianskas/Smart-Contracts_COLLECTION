const { network, ethers} = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parse("0.25"); // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas

// if the ETH price skyrockets to $100,000
// Chainlink nodes pay the gas fees to give us randomness and do external execution
// So they price of requests change based on the price of gas.

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const args = [BASE_FEE, GAS_PRICE_LINK];

    if(developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks... 🚀 👾");
        // deploy mock coordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        });

        log("Mocks Deployed!");
        log("----------------------------------------------------------");
    }
}

module.exports.tags = ["all", "mocks"];
