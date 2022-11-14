import React from 'react';
import {ConnectButton} from "@web3uikit/web3";
// import { ConnectButton } from '@web3uikit';

const Header = ({}) => {
    return (
        <div className="flex justify-between max-w-7xl mx-auto p-5 items-center">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold">Decentralized Lottery</p>
            <div>
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    );
};

export default Header;
// by Rokas with ❤️
