import React from 'react';
import {ConnectButton} from "@web3uikit/web3";
import Link from "next/link";

const Header = ({}) => {
    return (
        <nav className="flex justify-between p-5">
            <div>
                <Link href={'/'}>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold md:font-bold">NFT Marketplace</h1>
                </Link>
            </div>
            <div>
                <ConnectButton />
            </div>
        </nav>
    );
};

export default Header;
// by Rokas with ❤️
