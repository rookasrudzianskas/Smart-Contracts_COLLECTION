import React, {useState} from 'react';
import {useWeb3Contract} from "react-moralis";

const NftBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
    const [imageURI, setImageURI] = useState("");
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi:
    });

    async function updateUI() {
        const t
    }
    return (
        <div>

        </div>
    );
};

export default NftBox;
// by Rokas with ❤️
