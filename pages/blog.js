import Layout from "../components/Layout";
import AdBanner from "../components/AdBanner";

const articles = [
  {
    title: "Modelli e algoritmi per le remunerazioni DeFi",
    date: "22 gennaio 2025",
    readTime: "6 min",
    excerpt:
      "Framework su VaR, Markowitz, RNN e un piano operativo in otto fasi per implementare strategie di remunerazione e incentivi su attuario.network.",
    link: "/attuario-network-strategia",
  },
  {
    title: "Stress test attuariali sui protocolli di lending",
    date: "15 gennaio 2025",
    readTime: "8 min",
    excerpt:
      "Come valutare l'impatto di drawdown violenti su Aave e altri protocolli di prestito utilizzando scenari di health factor e liquidazione.",
    link: "/protocols/aave",
  },
  {
    title: "Strategie di copertura per market maker su Uniswap v3",
    date: "9 gennaio 2025",
    readTime: "7 min",
    excerpt:
      "Gestione attiva delle posizioni concentrate, coperture delta-neutral e monitoraggio dei costi di ribilanciamento on-chain.",
    link: "/protocols/uniswap",
  },
  {
    title: "Difendere la parità: analisi del rischio di de-peg su Curve",
    date: "20 dicembre 2024",
    readTime: "6 min",
    excerpt:
      "Indicatori precoci sullo stato delle stablecoin, ruolo dei gauge e come impostare alert quantitativi su Curve Finance.",
    link: "/protocols/curve",
  },
  {
    title: "Rendite da staking: combinare Lido e strumenti tradizionali",
    date: "12 dicembre 2024",
    readTime: "9 min",
    excerpt:
      "Costruire portafogli pensionistici con stETH, gestione del rischio di liquidità e diversificazione cross-chain.",
    link: "/protocols/lido",
  },
];

const resourceHighlights = [
  {
    title: "Calcolatore Staking",
    description:
      "Simula APY reali con compounding, scenari di drawdown e sensibilità al prezzo del token.",
    link: "/staking",
  },
  {
    title: "Modello Value at Risk",
    description:
      "Valuta la perdita potenziale massima su portafogli crypto con approccio parametrico.",
    link: "/var",
  },
  {
    title: "Piano Pensione Crypto",
    description:
      "Progetta un piano di accumulo sfruttando rendimenti DeFi e soglie di prelievo dinamiche.",
    link: "/pensione",
  },
];

export default function Blog() {
  return (
    <Layout>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <header style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2rem",
              fontSize: "0.75rem",
              color: "#7fffd4",
            }}
          >
            Crypto-Attuario Insights
          </p>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#00ffcc" }}>Blog</h1>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
            Analisi quantitative, framework attuariali e casi studio per prendere decisioni informate nella DeFi. Ogni settimana
            approfondiamo protocolli, metriche di rischio e metodologie di modellazione.
          </p>
        </header>

        <section style={{ display: "grid", gap: "1.5rem", marginBottom: "3rem" }}>
          {articles.map((article) => (
            <article
              key={article.title}
              style={{
                background: "#101318",
                borderRadius: "16px",
                padding: "1.75rem",
                border: "1px solid #1f2d36",
                boxShadow: "0 18px 35px -28px rgba(0, 255, 204, 0.6)",
              }}
            >
              <p style={{ color: "#7fffd4", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.18rem" }}>
                {article.date} • {article.readTime}
              </p>
              <h2 style={{ fontSize: "1.6rem", margin: "0.75rem 0", color: "#00ffcc" }}>
                {article.title}
              </h2>
              <p style={{ lineHeight: 1.7, marginBottom: "1.25rem" }}>{article.excerpt}</p>
              <a className="cta-btn" href={article.link}>
                Leggi l'analisi
              </a>
            </article>
          ))}
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Advertising & Sponsorship</h2>
          <p style={{ lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Spazi dedicati a sponsor selezionati che supportano la ricerca indipendente. Contattaci per progetti editoriali,
            white paper o placement personalizzati.
          </p>
          <AdBanner />
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Risorse in evidenza</h2>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {resourceHighlights.map((resource) => (
              <div
                key={resource.title}
                style={{
                  background: "#11161d",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #1f2d36",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.75rem" }}>{resource.title}</h3>
                <p style={{ lineHeight: 1.6, marginBottom: "1rem" }}>{resource.description}</p>
                <a className="cta-btn secondary" href={resource.link}>
                  Esplora strumento
                </a>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#101318",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid #1f2d36",
          }}
        >
          <h2 style={{ color: "#00ffcc", marginBottom: "0.75rem" }}>Newsletter attuariale</h2>
          <p style={{ lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Ricevi aggiornamenti mensili con insight su metriche di rischio, nuovi protocolli e benchmark tra DeFi e finanza
            tradizionale. Contenuti pensati per team di risk management, gestori di tesoreria e consulenti.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <a className="cta-btn" href="mailto:ricerche@crypto-attuario.com">
              Iscriviti via email
            </a>
            <a className="cta-btn secondary" href="/sponsor">
              Proponi una collaborazione
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
