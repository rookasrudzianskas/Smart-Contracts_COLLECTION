// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    // initial supply is 50  <- 50 WEI
    // initial supply 50e18
    // 50 * 10**18
    constructor(uint256 initialSupply) ERC20("Rokas Token", "ROO") {
        _mint(msg.sender, initialSupply);
    }
}
