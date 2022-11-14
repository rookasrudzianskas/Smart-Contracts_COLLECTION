import React from 'react';
import {useWeb3Contract} from "react-moralis";

const LotteryEntrance = ({}) => {

    const { data, error, runContractFunction: enterRaffle } = useWeb3Contract({
        abi: //,
        contractAddress: //,
        functionName: "observe",
        params: {},
        msgValue: //,
    })

    return (
        <div>

        </div>
    );
};

export default LotteryEntrance;
// by Rokas with ❤️
