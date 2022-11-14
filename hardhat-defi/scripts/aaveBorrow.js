const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const {getWeth, AMOUNT} = require("./getWeth");
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
    // Deposit
    const wethTokenAddress = networkConfig[network.config.chainId].wethToken;
    // approve
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
    // deposit
    console.log(`Depositing...`);
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
    console.log("DEPOSITED 🍏");

    // Borrow time
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, deployer);
    const daiPrice = await getDaiPrice();
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString());
    console.log(`You can borrow ${amountDaiToBorrow.toString()} DAI`);

    await borrowDai(
        networkConfig[network.config.chainId].daiToken,
        lendingPool,
        amountDaiToBorrowWei,
        deployer
    );

    await getBorrowUserData(lendingPool, deployer);

    await repay(
        amountDaiToBorrowWei,
        networkConfig[network.config.chainId].daiToken,
        lendingPool,
        deployer
    )

    await getBorrowUserData(lendingPool, deployer);
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account);
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
    await repayTx.wait(1);
    console.log("You've repaid!");
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account)
    await borrowTx.wait(1);
    console.log("You've borrowed!");
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId].daiEthPriceFeed
    );
    const price = await (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`DAI price is ${ethers.utils.formatUnits(price, 8)}`);
    return price;
}

async function getBorrowUserData(lendingPool, account) {
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH
    } = await lendingPool.getUserAccountData(account);
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`);
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`);
    console.log('-------------------------------------------');
    return { availableBorrowsETH, totalDebtETH };
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

async function approveErc20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account);
    const tx = await erc20Token.approve(spenderAddress, amountToSpend);
    console.log(`Approved! 🚀`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    });
