import React, {useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import {abi, contractAddresses} from "../constants";
import Moralis from "moralis-v1";
import {ethers} from "ethers";
import {useNotification} from "@web3uikit/core";

const LotteryEntrance = ({}) => {
    const {enableWeb3, account, isWeb3Enabled, deactivateWeb3, Moralis, isWeb3EnableLoading} = useMoralis();
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const {chainId: chainIdHex} = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();

    const { data, error, runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromContract);
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        setNumPlayers(numPlayersFromCall);
        const recentWinnerFromCall = (await getRecentWinner()).toString();
        setRecentWinner(recentWinnerFromCall);
        // console.log("SOMETHING>>>", entranceFeeFromContract);
    }

    useEffect(() => {
        if(isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification();
        updateUI();
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            title: "Success",
            message: "You have successfully entered the raffle!",
            status: "success",
            dismissAfter: 2000,
            position: "topR",
        });
    }

    return (
        <div className="max-w-7xl mx-auto p-5 border-t border-t-[2px]">
            {raffleAddress ? (
                <>
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold">Enter the lottery</p>
                        <p className="text-sm text-gray-500">Buy a ticket for {ethers.utils.formatUnits(entranceFee)} ETH</p>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <p>Players</p>
                        <p className="text-2xl font-bold">{numPlayers}</p>
                    </div>

                    <div className="flex flex-row items-center justify-between">
                        <p>Recent winner</p>
                        <p className="text-2xl font-bold">{recentWinner}</p>
                    </div>

                    <button onClick={async () => {
                        await enterRaffle({
                            onSuccess: (e) => {
                                // checks to see if the transaction was successful sent to metamask
                                handleSuccess(e);
                            },
                            onError: (error) => {
                                console.log("ERROR>>>", error);
                            }
                        });
                    }} className="mt-6 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded duration-150" >
                        Enter Raffle
                    </button>
                </>
            ) : (
                <div>
                    <p className="text-2xl font-bold">No Raffle address detected</p>
                </div>
            )}
        </div>
    );
};

export default LotteryEntrance;
// by Rokas with ❤️
