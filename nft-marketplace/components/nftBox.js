import React, {useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import nftAbi from '../constants/BasicNft.json';
import Image from "next/image";
import {Card} from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

const truncateString = (str, num) => {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}

const NftBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
    const [imageURI, setImageURI] = useState("");
    const { isWeb3Enabled, web3, isWeb3EnableLoading, account } = useMoralis();
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: 'tokenURI',
        params: {
            tokenId: tokenId,
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

    const handleCardClick = () => {
        isOwnedByUser ? setShowModal(true) : console.log("You can't buy this NFT");
    }


    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal isVisible={showModal} />
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
