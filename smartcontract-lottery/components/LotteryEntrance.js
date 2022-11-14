import React, {useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import {abi, contractAddresses} from "../constants";
import Moralis from "moralis-v1";
import ethers from "ethers";

const LotteryEntrance = ({}) => {
    const {enableWeb3, account, isWeb3Enabled, deactivateWeb3, Moralis, isWeb3EnableLoading} = useMoralis();
    const [entranceFee, setEntranceFee] = useState("0");
    const {chainId: chainIdHex} = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { data, error, runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: {},
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    useEffect(() => {
        (async () => {
            if(isWeb3Enabled) {
                const entranceFeeFromContract = (await getEntranceFee()).toString();
                setEntranceFee(ethers.utils.formatUnits(entranceFeeFromContract));
                // console.log("SOMETHING>>>", entranceFeeFromContract);
            }
        })();
    }, [isWeb3Enabled]);

    return (
        <div className="max-w-7xl mx-auto p-5 border-t border-t-[2px]">
            {entranceFee}
        </div>
    );
};

export default LotteryEntrance;
// by Rokas with ❤️
