import type { NextPage } from 'next'
import {useMoralisQuery} from "react-moralis";
import NftBox from '../components/NftBox';

const Home: NextPage = () => {
    const {data: listedNfts, isFetching: fetchingListedNfts} = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId"),
    );
    console.log(listedNfts);
    return (
        <div className="max-w-7xl mx-auto container">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
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
            </div>
        </div>
    )
}

export default Home
