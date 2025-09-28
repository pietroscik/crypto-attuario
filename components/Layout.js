import Script from "next/script";

export default function Layout({ children }) {
  return (
    <>
      {/* Script AdSense globale: caricato una sola volta */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8531177897035530"
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
            data-ad-client="ca-pub-8531177897035530"
            data-ad-slot="1234567890"   // <-- sostituisci con il tuo slot ID
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