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
          <p>Analisi, modelli quantitativi e valutazione del rischio per crypto / DeFi.</p>
        </section>
        <section className="features">
          <div>
            <h3>🔐 DeFi & Rischio</h3>
            <p>Studio delle piattaforme DeFi con metriche di rischio attuariale.</p>
          </div>
          <div>
            <h3>📈 Modelli attuariali</h3>
            <p>Applicazioni dei modelli stocastici al mondo crypto.</p>
          </div>
        </section>
      </main>
      <footer>
        <p>© 2025 Crypto-Attuario</p>
      </footer>
    </>
  );
}