import Head from "next/head"
import Navbar from "../components/Navbar/Navbar"
import LotteryEntrance from "../components/LotteryEntrance/LotteryEntrance"
import styles from "../styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <LotteryEntrance />
        </div>
    )
}
