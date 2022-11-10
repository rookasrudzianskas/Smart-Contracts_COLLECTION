const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage;
    // This beforeEach, defines what the test should do
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    })

    // and this it, defines what the test should expect
    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        // assert or expect
        // and asset checks the test output if it is true or false
        assert.equal(currentValue.toString(), expectedValue);
    })
})
// describe("SimpleStorage", () => {})
