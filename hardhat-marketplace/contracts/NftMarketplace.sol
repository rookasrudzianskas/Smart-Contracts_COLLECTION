// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

error NftMarketplace__PriceMustBeAboveZero();

contract NftMarketplace {

    //////////////////////////
    /////// Main functions////
    //////////////////////////

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        if(price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        // 1. Send the nft to contract Transfer -> Contract hold the nft
        // 2. Owners can still hold their nft, and give the marketplace approval to sell it for the marketplace.
        // the marketplace would have the option to sell the nft for the owner. But owner can still sell or take it out it for themselves.

    }
}
