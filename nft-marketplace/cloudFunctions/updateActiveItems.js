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


Moralis.Cloud.afterSave("ItemCancelled", async (request) => {
   const confirmed = request.object.get("confirmed");
   const logger = Moralis.Cloud.getLogger();
   logger.info("Looking for the cancelled TX items");
   if(confirmed) {
       const ActiveItem = Moralis.Object.extend("ActiveItem");
       const query = new Moralis.Query(ActiveItem);
       query.equalTo("marketplaceAddress", request.object.get("address"));
       query.equalTo("nftAddress", request.object.get("nftAddress"));
       query.equalTo("tokenId", request.object.get("tokenId"));
       logger.info(`Marketplace | Query: ${request.object.get("address")}. Token ID:  ${request.object.get("tokenId")}`);
       const canceledItem = await query.first();
       logger.info("Found item!", canceledItem);
       if(canceledItem) {
           logger.info(
               `Deleted item with tokenId ${request.object.get(
                   "tokenId"
               )} at address ${request.object.get("address")} since it was canceled. `
           );

           await canceledItem.destroy();
       } else {
           logger.info(
               `No item canceled with address: ${request.object.get(
                   "address"
               )} and tokenId: ${request.object.get("tokenId")} found.`
           );
       }
   }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info(`Marketplace | Object: ${request.object}`);
    if(confirmed) {
        logger.info("Looking for the bought TX items");
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const boughtItem = await query.first();
        if(boughtItem) {
            logger.info("Found item!", boughtItem);
            logger.info(
                `Deleted item with tokenId ${request.object.get("objectId")} at address ${request.object.get("address")} since it was bought. ` );
            await boughtItem.destroy();
        } else {
            logger.info(
                `No item bought with address: ${request.object.get("address")} and tokenId: ${request.object.get("tokenId")} found.`
            );
        }
    }
});
