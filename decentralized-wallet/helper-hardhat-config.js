const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        subscriptionId: "6375", // 6926
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
        interval: "30",
        // raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.1"), // 0.01 ETH
    },
    1: {
        name: "mainnet",
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.1"), // 0.01 ETH
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei,
        callbackGasLimit: "500000", // 500,000 gas
        interval: "30",
    }
}

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
    developmentChains,
    networkConfig,
}
