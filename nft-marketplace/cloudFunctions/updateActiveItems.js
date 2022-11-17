import Moralis from "moralis";

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for the confirmed TX items");
    if(confirmed) {
        logger.info("Found item!");
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        const activeItem = new ActiveItem();
        // We are getting all information from the event
        activeItem.set("marketplaceAddress", request.object.get("address"));
        activeItem.set("nftAddress", request.object.get("nftAddress"));
        activeItem.set("price", request.object.get("price"));
        activeItem.set("tokenId", request.object.get("tokenId"));
        activeItem.set("seller", request.object.get("seller"));
        logger.info(`Marketplace | Query: ${request.object.get("address")}. Token ID:  ${request.object.get("tokenId")}`);
        logger.info("Saving item to ActiveItem");
        await activeItem.save();
    }
});
