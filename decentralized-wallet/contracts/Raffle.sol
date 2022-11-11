// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Enter the lottery by sending some ETH to this contract.
// Pic a random winner
// Winner to be selected every x minutes -> completely automated
// Chainlink Oracle -> Randomness, Automated execution (Chainlink Keepers);
// Chainlink VRF -> Randomness

error Raffle_NotEnoughETHEntered();

contract Raffle {
    uint256 private immutable i_entranceFee;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() {
        // require msg.value > i_entranceFee
        if(msg.value < i_entranceFee) { revert Raffle_NotEnoughETHEntered(); }
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }
}

// function pickRandomWinner() {}
