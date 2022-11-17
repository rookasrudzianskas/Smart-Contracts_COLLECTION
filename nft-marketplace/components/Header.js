import React from 'react';
import {ConnectButton} from "@web3uikit/web3";

const Header = ({}) => {
    return (
        <nav className="flex justify-between p-5">
            <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold md:font-bold">NFT Marketplace</h1>
            </div>
            <div>
                <ConnectButton />
            </div>
        </nav>
    );
};

export default Header;
// by Rokas with ❤️
