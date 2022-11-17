const { network } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    let args = [];

    const nftMarketplace = await deploy("NFTMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || VERIFICATION_BLOCK_CONFIRMATIONS,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log(`Verifying NFTMarketplace on Etherscan...`);
        await verify(nftMarketplace.address, args);

        log("Verified! ✅");
        log("------------------------------------------------------------");
    }
}

module.exports.tags = ["all", "nFTMarketplace"];
