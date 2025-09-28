import '../styles/style.css'
import Head from "next/head"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8531177897035530"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}