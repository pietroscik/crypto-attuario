import "../styles/style.css"
import Head from "next/head"
import Script from "next/script"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAmp } from "next/amp"

const GA_MEASUREMENT_ID = 'G-7SBJ3PN329'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const isAmp = useAmp()

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_path: url,
      })
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {!isAmp && (
        <>
          {/* Google Analytics */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

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