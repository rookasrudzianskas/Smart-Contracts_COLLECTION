import type { NextPage } from 'next'
import {useMoralis, useMoralisQuery} from "react-moralis";
import NftBox from '../components/NftBox';

const Home: NextPage = () => {
    const {isWeb3Enabled} = useMoralis();
    const {data: listedNfts, isFetching: fetchingListedNfts} = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId"),
    );
    return (
        <div className="max-w-7xl mx-auto container">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    <>
                        {fetchingListedNfts ? <p>Loading...</p> : (
                            <>
                                {listedNfts?.map((nft) => {
                                    const { price, nftAddress, tokenId, marketplaceAddress, seller } = nft.attributes;
                                    return (
                                        <NftBox
                                            key={nft.id}
                                            price={price}
                                            nftAddress={nftAddress}
                                            tokenId={tokenId}
                                            marketplaceAddress={marketplaceAddress}
                                            seller={seller}
                                        />
                                    )
                                })}
                            </>
                        )}
                    </>
                ) : (
                    <div>
                        <p className="text-xl text-red-500 font-bold px-4">Web3 Currently not available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
