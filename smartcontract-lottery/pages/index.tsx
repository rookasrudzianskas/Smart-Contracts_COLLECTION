import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import LotteryEntrance from '../components/LotteryEntrance';

const Home: NextPage = () => {
    return (
        <div className="">
            <Head>
                <title>Web3 Lottery</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <LotteryEntrance />

        </div>
    )
}

export default Home;
