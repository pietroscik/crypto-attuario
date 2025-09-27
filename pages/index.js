export default function Home() {
  return (
    <>
      <header>
        <h1>Crypto-Attuario</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/sponsor">Collabora</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Finanza decentralizzata con approccio attuariale</h2>
          <p>
            Analisi, modelli quantitativi e valutazione del rischio applicati al mondo crypto
            e blockchain.
          </p>
        </section>

        <section className="features">
          <div>
            <h3>🔐 DeFi & Rischio</h3>
            <p>Studio delle piattaforme DeFi con metriche di rischio attuariale.</p>
          </div>
          <div>
            <h3>📈 Modelli attuariali</h3>
            <p>Applicazioni dei modelli stocastici al settore crypto.</p>
          </div>
          <div>
            <h3>🪙 Analisi mercati digitali</h3>
            <p>Approfondimenti su tokenomics, NFT e stablecoin da prospettiva attuariale.</p>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 Crypto-Attuario</p>
      </footer>
    </>
  );
}