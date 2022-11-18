import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {MoralisProvider} from "react-moralis";
import Head from "next/head";
import Header from '../components/Header';
import {NotificationProvider} from "@web3uikit/core";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
function MyApp({ Component, pageProps }: AppProps) {
    return (
      // @ts-ignore
      <MoralisProvider
          appId={APP_ID}
          serverUrl={SERVER_URL}
      >
          <Head>
              <title>NFT Marketplace</title>
              <link rel="icon" href="/favicon.ico" />
          </Head>
          {/* @ts-ignore */}
          <NotificationProvider />
          <Header />
        <Component {...pageProps} />
      </MoralisProvider>
  )
}

export default MyApp
