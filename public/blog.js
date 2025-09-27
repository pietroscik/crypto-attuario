export default function Blog() {
  return (
    <>
      <header>
        <h1>Blog</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/sponsor">Collabora con noi</a>
        </nav>
      </header>

      <main>
        <article>
          <h2>Benvenuto nel Blog</h2>
          <p>
            Qui troverai articoli su analisi attuariali, finanza quantitativa, innovazione e
            applicazioni al mondo crypto.
          </p>
        </article>

        <article>
          <h2>Cos’è il rischio in DeFi visto da un attuario</h2>
          <p>
            Un approccio quantitativo per valutare le piattaforme di finanza decentralizzata: metriche di rischio,
            volatilità e sostenibilità a lungo termine.
          </p>
        </article>
      </main>

      <footer>
        <p>© 2025 Crypto-Attuario</p>
      </footer>
    </>
  );
}