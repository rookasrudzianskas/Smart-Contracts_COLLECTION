// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Enter the lottery by sending some ETH to this contract.
// Pic a random winner
// Winner to be selected every x minutes -> completely automated
// Chainlink Oracle -> Randomness, Automated execution (Chainlink Keepers);
// Chainlink VRF -> Randomness

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

error Raffle_NotEnoughETHEntered();
error Raffle_TransferFailed();
error Raffle_NotOpen();

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    // Type declarations
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    // state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // Lottery variables
    address private s_recentWinner;
    RaffleState private s_raffleState;
    //Events
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
    }

    function enterRaffle() public payable {
        // require msg.value > i_entranceFee
        if(msg.value < i_entranceFee) { revert Raffle_NotEnoughETHEntered(); }
        if(s_raffleState != RaffleState.OPEN) { revert Raffle_NotOpen(); }
        // we keep track of all players
        s_players.push(payable(msg.sender));
        // Events | emit an event when we  update a dynamic array or mapping
        emit RaffleEnter(msg.sender);
    }

    // @dev this is the function that chainlink keeper nodes call they look for the `unKeepNeeded` to return true.
    // the following should be true for the function to return true:
    // 1. Our time interval has passed
    // 2. We have enough players
    // 3. Subscription funded with link
    // 4. Lottery should be in "open" state
    function checkUpkeep(bytes calldata /* checkData */) external override {

    }

    function requestRandomWinner() external {
        // Request a random number
        // Once we do, do something with it
        s_raffleState = RaffleState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords) internal override {
        // s_players size 10 random number 202
        // 202 % 10 = 2 ? what does not divide evenly into 202
        // 20 * 10 = 200
        // 2
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        (bool success, ) = recentWinner.call{ value: address(this).balance }("");

        if(!success) {
            revert Raffle_TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    // View pure functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}

