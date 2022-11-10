import { ethers } from "./ethers-5.6.esm.min.js";
// import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
}

async function fund(ethAmount) {
    console.log(`Funding ${ethAmount} ETH`);
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const contract = new ethers.Contract(contractAddress, abi, signer);
    }
}
