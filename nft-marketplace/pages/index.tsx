import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header';

const Home: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
    </div>
  )
}

export default Home
