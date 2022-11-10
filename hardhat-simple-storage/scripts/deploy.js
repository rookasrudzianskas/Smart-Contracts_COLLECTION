const { ethers, run, network } = require("hardhat");

async function main() {
      const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
      console.log("Deploying contract... 🚀");
      const simpleStorage = await SimpleStorageFactory.deploy();
      await simpleStorage.deployed();
      // What is the private key of the account that deployed the contract?
      // What is the rpc endpoint of the network that the contract is deployed to?
      console.log(`Contract deployed to ${simpleStorage.address} 🚀`);
      // What happens when we deploy this to our hardhat network?

      // Verifies the contract on Etherscan
      if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
            console.log("Waiting for block confirmations...");
            await simpleStorage.deployTransaction.wait(6);
            await verify(simpleStorage.address, []);
      }

      // Retrieves the value of the contract
      const currentValue = await simpleStorage.retrieve();
      console.log(`Current value is ${currentValue} 👈`);

      // Update the current value
      const transactionResponse = await simpleStorage.store(7);
      await transactionResponse.wait(1);
      const updatedValue = await simpleStorage.retrieve();
      console.log(`Updated value is ${updatedValue} 🍏`);
}

async function verify(contractAddress, args) {
      console.log("Verifying contract... 🚀");
      try {
            await run("verify:verify", {
                  address: contractAddress,
                  constructorArguments: args,
            });
      } catch (e) {
            if(e.message.toLowerCase().includes("already verified")) {
                  console.log("Contract already verified 🚀");
            } else {
                  console.log(e);
            }
      }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
});
