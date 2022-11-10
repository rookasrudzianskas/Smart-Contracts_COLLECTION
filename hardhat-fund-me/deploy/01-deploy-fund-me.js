const { network } = require("hardhat");
const hre = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
// module.exports = async function main(hre) {
//     console.log("deploying flashtoken!!");
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // if chainId is X use address Y
    // if chainId is z use address a
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    //if the contract does not exist, we deploy minimal version

    // When going for localhost or hardhat network we want to use a mock.
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], // priceFeedAddress
        log: true,
    })

}
