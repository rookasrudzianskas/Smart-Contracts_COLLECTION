const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts} = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

describe("FundMe", async function () {
   let fundMe;
   let deployer;
   let mockV3Aggregator;
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
   })
});
