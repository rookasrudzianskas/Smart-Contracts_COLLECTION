import React, {useState} from 'react';
import {Input, Modal, useNotification} from "@web3uikit/core";
import {useWeb3Contract} from "react-moralis";
import nftMarketplaceAbi from '../constants/NftMarketplace.json';

const UpdateListingModal = ({
                                nftAddress,
                                tokenId,
                                isVisible,
                                marketplaceAddress,
                                onClose,
                            }) => {

    const dispatch = useNotification();
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);
    const {runContractFunction: updateListing} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
    });

    const handleUpdateListingSuccess = () => {

    }


    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    );
};

export default UpdateListingModal;
// by Rokas with ❤️
