const { network, ethers} = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata");
const fs = require("fs");


module.exports = async ({ getNamedAccounts, deployments }) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock, ethUsdPriceFeedAddress;

    if(developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator");
        ethUsdPriceFeedAddress = EthUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }

    const lowSVG = fs.readFileSync("./images/dynamicNFT/frown.svg", {encoding: "utf8"});
    const highSVG = fs.readFileSync("./images/dynamicNFT/happy.svg", {encoding: "utf8"});

    let args = [ethUsdPriceFeedAddress, lowSVG, highSVG];
    const dynamicSvgNft = await deploy("DynamicSvgNft", {
       from: deployer,
       args: args,
       log: true,
       waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(dynamicSvgNft.address, arguments);
    }

}


module.exports.tags = ["all", "dynamicsvg", "main"];
