import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header';
import {useMoralisQuery} from "react-moralis";

const Home: NextPage = () => {
    const {data: listedNfts, isFetching: fetchingListedNfts} = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId"),
    );
    console.log(listedNfts);
    return (
        <div className="max-w-7xl mx-auto">
            {fetchingListedNfts ? <p>Loading...</p> : (
                <>
                    {listedNfts?.map((nft) => {
                        const { price, nftAddress, tokenId, marketplaceAddress, seller } = nft.attributes;
                        return (
                            <div key={nft.id}>
                                <p>{price}</p>
                                <p>{nftAddress}</p>
                                <Image
                                    src={seller}
                                    alt={seller}
                                    width={300}
                                    height={300}
                                />
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default Home
