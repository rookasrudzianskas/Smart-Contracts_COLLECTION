const { network, ethers } = require("hardhat");


module.exports = async ({ getNamedAccounts }) => {
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    // Basic NFT
    const basicNft = await ethers.getContract("BasicNft", deployer);
    const basicMintTx = await basicNft.mint();
    await basicMintTx.wait(1);
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`);

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
    const mintFee = await randomIpfsNft.getMintFee();

    await new Promise(async (resolve, reject) => {

    }

        const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() });
    await randomIpfsNftMintTx

}

module.exports.tags = ["all", "mint"];
