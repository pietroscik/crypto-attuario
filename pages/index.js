import Head from "next/head";

import AdBanner from "../components/AdBanner";

export default function Home() {
  return (
    <>
      <header className="header">
        <h1>Crypto-Attuario</h1>
      </header>

      <main>
        <section className="hero">
          <h2>Benvenuto su Crypto-Attuario</h2>
          <p>Analisi quantitativa della DeFi con metodo attuariale</p>
        </section>

        {/* Qui appare il banner AdSense */}
        <AdBanner />
      </main>
    </>
  );
}
export default function Home() {
  return (
    <>
      <Head>
        {/* Verifica proprietà AdSense */}
        <meta
          name="google-adsense-account"
          content="ca-pub-8531177897035530"
        />

        {/* Script AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8531177897035530"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <header className="header">
        <h1>Crypto-Attuario</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/sponsor">Collabora</a>
          <a href="/staking">Staking</a>
          <a href="/rendita">Rendita</a>
          <a href="/var">VaR</a>
          <a href="/pensione">Pensione</a>
          <a href="/confronto">DeFi vs TradFi</a>
          <a href="/defi">Analisi DeFi</a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <h2>Finanza Decentralizzata con Metodo Attuariale</h2>
          <p>
            Un approccio scientifico alla valutazione del rischio e alle opportunità
            della blockchain e della DeFi.
          </p>
          <a href="/staking" className="cta-btn">Inizia Ora</a>
        </section>

        {/* Servizi */}
        <section className="services">
          <h2>I nostri strumenti</h2>
          <div className="grid">
            <div className="card">
              <h3>🔐 Staking</h3>
              <p>Calcolatore di rendimento con o senza interessi composti.</p>
            </div>
            <div className="card">
              <h3>📊 Rendita</h3>
              <p>Analisi e simulazione di flussi di rendita crypto.</p>
            </div>
            <div className="card">
              <h3>📉 Value at Risk</h3>
              <p>Misura la perdita massima attesa con metodi attuariali.</p>
            </div>
            <div className="card">
              <h3>🏦 Pensione Crypto</h3>
              <p>Proiezioni pensionistiche basate su asset digitali.</p>
            </div>
            <div className="card">
              <h3>⚖️ Confronto DeFi/TradFi</h3>
              <p>Analisi comparativa tra mercati decentralizzati e tradizionali.</p>
            </div>
            <div className="card">
              <h3>📈 Analisi DeFi</h3>
              <p>Dashboard sui principali protocolli: Aave, Lido, Curve, Uniswap.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 Crypto-Attuario • Ricerca e analisi quantitative</p>
      </footer>
    </>
  );
}