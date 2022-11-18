import React, {useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import nftAbi from '../constants/BasicNft.json';
import Image from "next/image";
import {Card} from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";
import nftMarketplaceAbi from '../constants/NftMarketplace.json';

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}
const NftBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
    const [imageURI, setImageURI] = useState("");
    const { isWeb3Enabled, web3, isWeb3EnableLoading, account } = useMoralis();
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);
    const dispatch = useNotification();
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: 'tokenURI',
        params: {
            tokenId: tokenId,
        }
    });

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: 'buyItem',
        msgValue: price,
        params: {
            tokenId: tokenId,
            nftAddress: nftAddress,
        }
    });

    const isOwnedByUser = account === seller || seller === undefined;
    const formattedSellerAddress = "You" ? seller.slice(0, 6) + "..." + seller.slice(-4) : "N/A";

    async function updateUI() {
        const tokenURI = await getTokenURI();
        if(tokenURI) {
            // IPFS gateway which will return IPFS files from normal URL
            const requestUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const tokenURIResponse = await (await fetch(requestUrl)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            setImageURI(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
            // We could render on server, but we will do it on client
            // for the testnets which don't have a lot of ETH
            // for world to adapt IPFS gateway
        }
    }

    useEffect(() => {
        if(isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        });
    }

    const handleCardClick = () => {
        isOwnedByUser ? setShowModal(true) : buyItem({
            onError: (error) => {
                console.log(error)
            },
            onSuccess: (tx) => {
                console.log(tx);
                handleBuyItemSuccess(tx);
            }
        });
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                            isVisible={showModal} />
                        <Card
                            onClick={handleCardClick}
                            title={tokenName}
                            description={tokenDescription}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic">Owned by: {formattedSellerAddress}</div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        alt="Picture of the author"
                                        width={200}
                                        height={200}
                                    />
                                    <div className="font-bold">{ethers.utils.formatUnits(price, "ether")}</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>
                        Loading...
                    </div>
                )}
            </div>
        </div>
    );
};

export default NftBox;
// by Rokas with ❤️
