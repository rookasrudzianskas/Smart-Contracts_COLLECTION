// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Enter the lottery by sending some ETH to this contract.
// Pic a random winner
// Winner to be selected every x minutes -> completely automated
// Chainlink Oracle -> Randomness, Automated execution (Chainlink Keepers);
// Chainlink VRF -> Randomness

error Raffle_NotEnoughETHEntered();

contract Raffle {
    // state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        // require msg.value > i_entranceFee
        if(msg.value < i_entranceFee) { revert Raffle_NotEnoughETHEntered(); }
        // we keep track of all players
        s_players.push(payable(msg.sender));
        // Events

    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }
}

// function pickRandomWinner() {}
