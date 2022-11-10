const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log(`FundMe address: ${fundMe.address}`);
    const transactionResponse = await fundMe.fund({ value: ethers.utils.parseEther("0.1") });
    await transactionResponse.wait(1);
    console.log("Funded contract 🚀" );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
