import React, {useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import nftAbi from '../constants/BasicNft.json';
import Moralis from "moralis-v1";

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
