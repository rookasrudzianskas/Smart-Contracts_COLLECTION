// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Enter the lottery by sending some ETH to this contract.
// Pic a random winner
// Winner to be selected every x minutes -> completely automated
// Chainlink Oracle -> Randomness, Automated execution (Chainlink Keepers);
// Chainlink VRF -> Randomness

import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';

error Raffle_NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    // state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    //Events
    event RaffleEnter(address indexed player);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
    }

    function enterRaffle() public payable {
        // require msg.value > i_entranceFee
        if(msg.value < i_entranceFee) { revert Raffle_NotEnoughETHEntered(); }
        // we keep track of all players
        s_players.push(payable(msg.sender));
        // Events | emit an event when we  update a dynamic array or mapping
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() external {
        // Request a random number
        // Once we do, do something with it
        i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
        )
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

    }

    // View pure functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }
}

