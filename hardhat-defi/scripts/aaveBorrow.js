const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const {getWeth} = require("./getWeth");
async function main() {
    // 100000000000000000 WETH
    await getWeth();
    const { deployer } = await getNamedAccounts();
    // abi, address
    // 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    // Leading pool
    // const lendingPoolAddressesProvider = await ethers.getContractAt("ILendingPoolAddressesProvider", "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", deployer);
    const lendingPool = await getLendingPool(deployer);
    console.log(`Lending pool address ${lendingPool.address}`);

}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    );

    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool;
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    });
