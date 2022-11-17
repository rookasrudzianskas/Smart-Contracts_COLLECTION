import React from 'react';
import {ConnectButton} from "@web3uikit/web3";
import Link from "next/link";

const Header = ({}) => {
    return (
        <nav className="flex justify-between p-5 border-b-[2px]">
            <div>
                <Link href={'/'}>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold md:font-bold">NFT Marketplace</h1>
                </Link>
            </div>
            <div className="flex flex-row items-center space-x-3">
                <Link className="text-sm font-semibold hover:bg-gray-200 py-1 px-2 rounded duration-150" href={'/'}>
                    Home
                </Link>
                <Link className="text-sm font-semibold hover:bg-gray-200 py-1 px-2 rounded duration-150" href={'/sell-nft'}>Sell NFT</Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    );
};

export default Header;
// by Rokas with ❤️
