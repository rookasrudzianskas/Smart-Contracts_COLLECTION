const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts} = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

describe("FundMe", async function () {
   let fundMe;
   let deployer;
   let mockV3Aggregator;
   const sendValue = ethers.utils.parseEther("1");
   beforeEach(async function () {
      //deploy fund me
      // 👇 this gets the accounts?
      // const accounts = await ethers.getSigners();
      // to deploy all of them
      deployer = (await getNamedAccounts()).deployer;
      await deployments.fixture(["all"]);
      // This gonna gets the most recent deployment of the contract
      fundMe = await ethers.getContract("FundMe", deployer);
      mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
   })
   describe("constructor", async function () {
      it("Sets the aggregator addresses correctly", async function () {
         const response = await fundMe.priceFeed();
         assert.equal(response, mockV3Aggregator.address);
      })
   });

   describe("fund", function () {
      // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
      // could also do assert.fail
      it("Fails if you don't send enough ETH", async () => {
         await expect(fundMe.fund()).to.be.revertedWith(
             "You need to spend more ETH!"
         )
      })

      it("Updated the amount funded data structure", async () => {
         await fundMe.fund({ value: sendValue });
         const response = await fundMe.addressToAmountFunded(
             deployer
         );
         assert.equal(response.toString(), sendValue.toString());
      });

      it("Adds funder to array of funders", async () => {
         await fundMe.fund({ value: sendValue });
         const funder = await fundMe.funders(0);
         assert.equal(funder, deployer);
      })
   });

   describe("withdraw", async function () {
      beforeEach(async function () {
         await fundMe.fund({ value: sendValue });
      });

      it("withdraw ETH from a single founder", async function () {
         // Arrange
         const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
         const startingDeployerBalance = await fundMe.provider.getBalance(deployer);
         // Act
         const transactionResponse = await fundMe.withdraw();
         const transactionReceipt = await transactionResponse.wait(1);
         const { gasUsed, effectiveGasPrice } = transactionReceipt;
         const gasCost = gasUsed.mul(effectiveGasPrice);

         const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
         const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
         // Assert
         assert.equal(endingFundMeBalance, 0);
         assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString());
      });
   })


});
