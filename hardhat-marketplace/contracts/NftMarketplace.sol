// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();

contract NftMarketplace {

    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // NFT contract address => NFT TokenID => Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;


    //////////////////////////
    ////// MODIFIERS /////////
    //////////////////////////
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(address nftAddress, uint256 tokenId, address spender) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if(spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }



    //////////////////////////
    /////// Main functions////
    //////////////////////////
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external
    // this checks if it not listed yet
    notListed(nftAddress, tokenId, msg.sender)
    // and makes sure the spender is the owner 🔥
    isOwner(nftAddress, tokenId, msg.sender)
    {
        if(price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        // 1. Send the nft to contract Transfer -> Contract hold the nft
        // 2. Owners can still hold their nft, and give the marketplace approval to sell it for the marketplace.
        // the marketplace would have the option to sell the nft for the owner. But owner can still sell or take it out it for themselves.
        IERC721 nft = IERC721(nftAddress);
        // if we are not approved for the nft, we can't sell it.
        if(nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
        // array? mapping? struct?

    }
}
