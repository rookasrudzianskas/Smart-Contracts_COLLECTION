import React, {useEffect} from 'react';
import {MoralisProvider, useMoralis} from "react-moralis";

const ManualHeader = ({}) => {
    const {enableWeb3, account, isWeb3Enabled, deactivateWeb3, Moralis, isWeb3EnableLoading} = useMoralis();

    useEffect(() => {
        if(isWeb3Enabled) return;
        if(typeof window !== 'undefined') {
            if(window.localStorage.getItem('injected')) {
                enableWeb3();
            }
        }
    }, []);

    useEffect(() => {
        Moralis.onAccountChanged(() => {
            console.log("Account changed to", account);
            if(account === null) {
                window.localStorage.removeItem('connected');
                deactivateWeb3();
            }
        })
    }, [account]);

    return (
        <div className="flex justify-between max-w-7xl mx-auto p-5 items-center">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold">Decentralized Lottery</p>
            <div>
                {account ? (
                    <button disabled={isWeb3EnableLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150 disabled:bg-gray-300">
                       Connected to - {account.slice(0, 5)}...{account.slice(-4)}
                    </button>
                ) : (
                    <button onClick={async () => {
                        await enableWeb3();
                        if(typeof window !== 'undefined') {
                            window.localStorage.setItem('connected', "injected");
                        }
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
                        Connect Wallet
                    </button>
                )}
            </div>
        </div>
    );
};

export default ManualHeader;
// by Rokas with ❤️
