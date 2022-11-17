import React, {useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import nftAbi from '../constants/BasicNft.json';

const NftBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
    const [imageURI, setImageURI] = useState("");
    const { isWeb3Enabled, web3, isWeb3EnableLoading } = useMoralis();
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: 'tokenURI',
        params: {
            tokenId: tokenId,
        }
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();
        if(tokenURI) {
            // IPFS gateway which will return IPFS files from normal URL
            const requestUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const tokenURIResponse = await (await fetch(requestUrl)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            setImageURI(imageURIURL);
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


    return (
        <div>

        </div>
    );
};

export default NftBox;
// by Rokas with ❤️
