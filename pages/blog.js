import Link from "next/link";
import AdBanner from "../components/AdBanner";
import Layout from "../components/Layout";
import blogPosts from "../data/blogPosts";

const categories = [
  "Risk Management",
  "DeFi Analytics",
  "Assicurazioni",
  "Compliance",
  "Ricerca attuariale",
];

export default function Blog() {
  return (
    <Layout
      title="Crypto-Attuario | Blog su rischio, DeFi e attuariato"
      description="Analisi approfondite su protocolli DeFi, gestione del rischio, normative e applicazioni attuariali al mondo crypto."
    >
      <section className="page-hero">
        <h1>Knowledge base attuariale per la DeFi</h1>
        <p>
          Report, framework quantitativi e casi studio per professionisti,
          assicurazioni e investitori che vogliono valutare protocolli
          decentralizzati con metodo.
        </p>
        <ul className="hero-list">
          <li>📌 Metriche di rischio applicate a stablecoin, staking e liquidity pool.</li>
          <li>🛡️ Strategie di copertura e assicurazione native Web3.</li>
          <li>📚 Guide operative su governance, reporting e compliance.</li>
        </ul>
      </section>

      <AdBanner />

      <section className="categories">
        <h2 className="section-title">Percorsi di lettura</h2>
        <div className="pill-group">
          {categories.map((category) => (
            <span key={category} className="pill">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="grid blog-grid">
        {blogPosts.map((post) => (
          <article key={post.slug} id={post.slug} className="card blog-card">
            <header>
              <span className="pill pill-light">{post.category}</span>
              <h3>{post.title}</h3>
            </header>
            <p>{post.summary}</p>
            <footer>
              <div className="tag-list">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="card-footer">
                <span className="read-time">⏱ {post.readTime}</span>
                <Link href={`#${post.slug}`} className="pill">
                  In arrivo
                </Link>
              </div>
            </footer>
          </article>
        ))}
      </section>

      <section className="callout">
        <div className="card">
          <h2>Contribuisci con la tua ricerca</h2>
          <p>
            Cerchiamo attuari, risk manager e sviluppatori Web3 per co-creare
            analisi, dataset e modelli open source. Scrivici per proporre un
            articolo o condividere dati.
          </p>
          <a className="pill" href="mailto:info@cryptoattuario.com">
            Proponi un contenuto
          </a>
        </div>
      </section>
    </Layout>
  );
}
