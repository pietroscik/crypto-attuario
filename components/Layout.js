import Script from "next/script";
import { ADSENSE_CLIENT_ID, ADSENSE_SLOT_ID } from "./adConfig";

export default function Layout({ children }) {
  return (
    <>
      {/* Script AdSense globale: caricato una sola volta */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <header className="header">
        <h1>Crypto-Attuario</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/staking">Staking</a>
          <a href="/rendita">Rendita</a>
          <a href="/var">VaR</a>
          <a href="/utilities">Utility</a>
          <a href="/pensione">Pensione</a>
          <a href="/confronto">DeFi vs TradFi</a>
          <a href="/sponsor">Collabora</a>
        </nav>
      </header>

      <main>
        {/* Banner AdSense globale */}
        <section className="ads-container">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={ADSENSE_SLOT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <Script id="ads-init">{`
            (adsbygoogle = window.adsbygoogle || []).push({});
          `}</Script>
        </section>

        {children}
      </main>

      <footer>
        <p>© 2025 Crypto-Attuario • Ricerca e analisi quantitative</p>
        <small>⚠️ Non forniamo consulenza finanziaria. Solo fini educativi e di ricerca.</small>
      </footer>
    </>
  );
}
