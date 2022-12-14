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
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketplace__NoProceeds();
error NftMarketplace__TransferFailed();

contract NftMarketplace is ReentrancyGuard {

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

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    // NFT contract address => NFT TokenID => Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // Seller address -> Amount Earned
    mapping(address => uint256) private s_proceeds;


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

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    //////////////////////////
    /////// Main functions////
    //////////////////////////
   /*
     * @notice Method for listing NFT
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param price sale price for each item
   */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external
    // this checks if it not listed yet
    notListed(nftAddress, tokenId, msg.sender)
    // and makes sure the spender is the owner ????
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

    function buyItem(address nftAddress, uint256 tokenId)
    external
    payable
    nonReentrant
    isListed(nftAddress, tokenId) {
        // this gets the listing from the mapping and stores it in memory for the rest of the function
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if(msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        // We have to keep track of how much money people have earned selling NFTs
        // We will update the proceeds of seller,
        // We do not just send the money to seller. Shift the risk
        // Have them withdraw the money themselves
        // Sending the money to the seller could be a reentrancy attack ??????
        // Have them withdraw the money themselves ???
        s_proceeds[listedItem.seller] = s_proceeds[listedItem.seller] + msg.value;
        // we have to delete the listing of seller
        delete (s_listings[nftAddress][tokenId]);
        // always change the state, before calling transfer or send
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        // Check to make sure NFT was transferred
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external isOwner(
        nftAddress,
            tokenId,
            msg.sender
    ) isListed(nftAddress, tokenId) {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender ) {
        // Actually just relisting with the new price
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if(proceeds <= 0 ) {
            revert NftMarketplace__NoProceeds();
        }
        // Reset first before sending
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if(!success) {
            // If the transfer fails, we want to reset the proceeds
           revert NftMarketplace__TransferFailed();
        }

    }

    //////////////////////////
    /// GETTER FUNCTIONS /////
    //////////////////////////

    function getListing(address nftAddress, uint256 tokenId) external view returns(Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns(uint256) {
        return s_proceeds[seller];
    }
}
