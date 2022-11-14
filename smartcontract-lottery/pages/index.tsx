import type { NextPage } from 'next';
import Head from 'next/head';
import ManualHeader from '../components/ManualHeader';

const Home: NextPage = () => {
    return (
        <div className="">
            <Head>
                <title>Web3 Lottery</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ManualHeader />

        </div>
    )
}

export default Home;
