const { network } = require("hardhat");
const hre = require("hardhat");

// module.exports = async function main(hre) {
//     console.log("deploying flashtoken!!");
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // When going for localhost or hardhat network we want to use a mock.

}
