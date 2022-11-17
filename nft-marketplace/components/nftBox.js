import React, {useEffect, useState} from 'react';
import {useWeb3Contract} from "react-moralis";
import nftAbi from '../constants/BasicNft.json';
import Moralis from "moralis-v1";
import isWeb3Enabled from "Moralis.isWeb3Enabled";

const NftBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
    const [imageURI, setImageURI] = useState("");
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
        console.log(tokenURI);
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
