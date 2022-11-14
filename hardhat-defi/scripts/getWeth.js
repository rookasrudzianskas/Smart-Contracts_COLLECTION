const { ethers, getNamedAccounts, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

const AMOUNT = ethers.utils.parseEther("0.1");

async function getWeth() {
    // Depositing to get WETH Token in here
    const { deployer } = await getNamedAccounts();
    const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer);
    const tx = await iWeth.deposit({ value: AMOUNT });
    tx.wait(1);
    const wethBalance = await iWeth.balanceOf(deployer);
    console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth, AMOUNT };
