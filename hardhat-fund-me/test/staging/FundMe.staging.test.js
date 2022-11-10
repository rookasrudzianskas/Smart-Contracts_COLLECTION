const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name) ? describe.skip : describe("FundMe", function () {
    let fundMe;
    let deployer;
    const sendValue = ethers.utils.parseEther("1");
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
    });

    it("allows people to fund and withdraw", async function () {

    });
    });
