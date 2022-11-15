const { network, ethers} = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")
const {storeImages, storeTokenMetadata, storeTokenUriMetadata} = require("../utils/uploadToPinata");
require("dotenv").config();

const imagesLocation = "./images/randomNft";

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100
        },
    ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress, vrfCoordinatorV2Address, subscriptionId, tokenUris;

    // get the ipfs hashes for the images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        console.log("Uploading images to Pinata... 🚀");
        tokenUris = await handleTokenUris();
        console.log("Images uploaded to Pinata! ✅");
    }
    // with our own IPFS node or programmatically


    if(developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);
        subscriptionId = txReceipt.events[0].args.subscriptionId;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log("----------------------------------------------------");

    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].gasLane,
    //     networkConfig[chainId].callbackGasLimit,
    //     networkConfig[chainId].mintFee
    // ];

    async function handleTokenUris() {
        tokenUris = [];
        // store the image in IPFS and store data in IPFS
        const { responses: imageUploadResponses, files } = await storeImages(imagesLocation);
        for (let imageUploadResponseIndex in imageUploadResponses) {
            // create metadata
            // upload metadata to IPFS
            let tokenUriMetadata = { ...metadataTemplate };
            // pug.png, pug.jpg, pug.jpeg
            tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
            tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
            tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
            console.log("FORMING METADATA FOR TOKEN URI");
            // console.log(`tokenUriMetadata: ${JSON.stringify(tokenUriMetadata, null, 4)}`);
            // store the file JSON in IPFS
            const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
            // We will have the array of IPFS hashes, that points to the metadata of each token
            tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
        }
        console.log("Token URIs Uploaded! They are:");
        console.log(tokenUris);
        return tokenUris;
    }


    // Verify the deployment
    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying...")
    //     await verify(dynamicSvgNft.address, arguments)
    // }
}

module.exports.tags = ["all", "randomipfs", "main"];
