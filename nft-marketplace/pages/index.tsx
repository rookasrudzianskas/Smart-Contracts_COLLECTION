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
  return (
    <div className="max-w-7xl mx-auto">
    </div>
  )
}

export default Home
