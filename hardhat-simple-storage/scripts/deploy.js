const { ethers, run, network } = require("hardhat");

async function main() {
      const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
      console.log("Deploying contract... 🚀");
      const simpleStorage = await SimpleStorageFactory.deploy();
      await simpleStorage.deployed();
      // What is the private key of the account that deployed the contract?
      // What is the rpc endpoint of the network that the contract is deployed to?
      console.log(`Contract deployed to ${simpleStorage.address} 🚀`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
});
