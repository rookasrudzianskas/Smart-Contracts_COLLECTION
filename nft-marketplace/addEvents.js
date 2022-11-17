const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");
let chainId = process.env.chainId || 31337;
let moralisChainId = chainId == "31337" ? "1337" : chainId;
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(`Moralis serverUrl: ${contractAddress}`);

    let itemListedOptions = {
        // Moralis understands local chain as 1337
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256,uint256)",
        address: contractAddress,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    }

    let itemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemBought(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    }

    let itemCanceledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemCanceled(address,address,uint256)",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        tableName: "ItemCanceled",
    }
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
