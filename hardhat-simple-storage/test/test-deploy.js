const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage;
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    })

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = 0;
        // assert or expect
    })
})
// describe("SimpleStorage", () => {})
