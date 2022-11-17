const { ethers, network } = require("hardhat");
// const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract("BasicNft");
    console.log("Minting NFT...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log("Minted NFT with tokenId", tokenId.toString());
    console.log("Approving NFT for sale...");

    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
    await approvalTx.wait(1);
    console.log("Listing NFT for sale...");
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
    console.log("Listed NFT for sale");
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
