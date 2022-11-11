const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts} = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
        let raffle, raffleContract, vrfCoordinatorV2Mock, raffleEntranceFee, interval, player, deployer;
        const chainId = network.config.chainId;

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);
            raffle = await ethers.getContract("Raffle", deployer);
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
            raffleContract = await raffle.getEntranceFee();
            interval = await raffle.getInterval();
            raffleEntranceFee = await raffle.getEntranceFee();
        });

        describe("constructor", function () {
            it("initialized the raffle correctly", async function () {
                const raffleState = await raffle.getRaffleState();
                const interval = await raffle.getInterval();
                assert.equal(raffleState.toString(), "0");
                assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
            });
        });

        describe("enterRaffle", async function () {
           it("reverts when you do not pay enough", async function () {
               await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered");
           });

           it("records players then they enter", async function () {
               await raffle.enterRaffle({ value: raffleEntranceFee });
               const playerFromContract = await raffle.getPlayers(0);
               assert.equal(playerFromContract, deployer);
           });

            it("emits event on enter", async function() {
                await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit( // emits RaffleEnter event if entered to index player(s) address
                    raffle,
                    "RaffleEnter"
                )
            });

           it("does not allow you enter when raffle is calculating", async function () {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.send("evm_mine", []);
                // We pretend to be chain keeper here
                await raffle.performUpkeep([]);
                await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith("Raffle__NotOpen");
           });
        });

        describe("checkUpkeep", function () {
            it("returns false if people have not sent any ETH", async function () {
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.send("evm_mine", []);
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
                assert(!upkeepNeeded);
            });

            it("returns false if raffle is not open", async function () {
                await raffle.enterRaffle({ value: raffleEntranceFee })
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.request({ method: "evm_mine", params: [] })
                await raffle.performUpkeep([]) // changes the state to calculating
                const raffleState = await raffle.getRaffleState() // stores the new state
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                assert.equal(raffleState.toString() == "1", upkeepNeeded == false)
            });

            it("returns false if enough time hasn't passed", async () => {
                await raffle.enterRaffle({ value: raffleEntranceFee })
                await network.provider.send("evm_increaseTime", [interval.toNumber() - 5]) // use a higher number here if this test fails
                await network.provider.request({ method: "evm_mine", params: [] })
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                assert(!upkeepNeeded)
            });

            it("returns true if enough time has passed, has players, eth, and is open", async () => {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.request({ method: "evm_mine", params: [] });
                const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x");
                assert(upkeepNeeded);
            });
        });

        describe("performUpkeep", function () {
            it("can only run if checkupkeep is true", async  function () {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.request({ method: "evm_mine", params: [] });
                const tx = await raffle.performUpkeep("0x");
                assert(tx);
            });

            it("reverts if checkup is false", async () => {
                await expect(raffle.performUpkeep("0x")).to.be.revertedWith("Raffle__UpkeepNotNeeded");
            });

            it("updates the raffle state and emits a requestId", async () => {
                await raffle.enterRaffle({ value: raffleEntranceFee });
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
                await network.provider.request({ method: "evm_mine", params: [] });
                const txResponse = await raffle.performUpkeep("0x");
                const txReceipt = await txResponse.wait(1);
                const raffleState = await raffle.getRaffleState() // updates state to calculating
                const requestId = txReceipt.events[1].args.requestId;
                assert(requestId.toNumber() > 0)
                assert(raffleState == 1) // 0 = open, 1 = calculating
            });
            });

        describe("fulfillRandomWords", function () {
            beforeEach(async () => {
               await raffle.enterRaffle({ value: raffleEntranceFee });
               await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
               await network.provider.send("evm_mine", []);
            });

            it("can only be called after performupkeep", async () => {
               await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith("nonexistent request");
                await expect(
                    vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address) // reverts if not fulfilled
                ).to.be.revertedWith("nonexistent request");
            });

            it("picks a winner, resets, and sends money", async () => {
                const additionalEntrances = 3; // to test
                const startingAccountIndex = 1;
                const accounts = await ethers.getSigners();

                // a bunch of people enter the lottery
                for(let i = startingAccountIndex; i < startingAccountIndex + additionalEntrances; i++) {
                    const accountConnectedRaffle = raffle.connect(accounts[i]);
                    await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee });
                }
                const startingTimestamp = await raffle.getLatestTimestamp();

                // This will be more important for our staging tests...
                await new Promise(async (resolve, reject) => {
                    raffle.once("WinnerPicked", async () => {
                        console.log("WinnerPicked event fired! 🔥");
                        // assert throws an error if it fails, so we need to wrap
                        // it in a try/catch so that the promise returns event
                        // if it fails.
                        try {
                            const recentWinner = await raffle.getRecentWinner();
                            const raffleState = await raffle.getRaffleState();
                            const endingTimeStamp = await raffle.getLatestTimestamp();
                            const numPlayers = await raffle.getNumberOfPlayers();
                            const winnerEndingBalance = await accounts[1].getBalance();
                            assert(numPlayers.toString(), "0");
                            assert(raffleState.toString(), "0");
                            assert(endingTimeStamp.toString() > startingTimestamp.toString());

                            assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(raffleEntranceFee.mul(additionalEntrances).add(raffleEntranceFee).toString()));
                            assert(endingTimeStamp > startingTimestamp);
                        } catch (error) {
                            reject(error);
                            console.log(`Error: ${error}`);
                        }
                        resolve();
                    });
                    // we perform upkeep and then fulfillrandomwords and this is exactly what this shit does
                    const tx = await raffle.performUpkeep("0x");
                    const txReceipt = await tx.wait(1);
                    const winnerStartingBalance = await accounts[1].getBalance();
                    // ONLY THEN THIS TRANSACTION IS CALLED, we do the test 👆
                    await vrfCoordinatorV2Mock.fulfillRandomWords(
                        txReceipt.events[1].args.requestId,
                        raffle.address
                    )
                });
            });


            });

        });
