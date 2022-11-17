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

}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
