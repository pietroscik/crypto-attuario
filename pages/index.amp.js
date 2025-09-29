import Head from "next/head"

export const config = { amp: true }

const ampStyles = `
  :root {
    color-scheme: dark;
  }

  body {
    margin: 0;
    font-family: "Inter", Arial, sans-serif;
    background: #000;
    color: #f1f1f1;
    line-height: 1.6;
  }

  a {
    color: inherit;
  }

  main {
    display: block;
  }

  .page-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #000;
  }

  .page-header,
  .page-shell main,
  .page-shell footer {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .page-header {
    padding-top: 2.5rem;
    padding-bottom: 1.5rem;
  }

  .page-title {
    font-size: 2.5rem;
    margin: 0 0 0.5rem;
    color: #00ffcc;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.65;
    color: #a8d5ff;
  }

  .section {
    margin-bottom: 2.75rem;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .card,
  .list-card {
    border: 1px solid rgba(0, 255, 204, 0.25);
    border-radius: 16px;
    padding: 1.35rem;
    background: #050505;
    box-shadow: 0 20px 40px -24px rgba(0, 0, 0, 0.9);
    transition: border-color 180ms ease, transform 180ms ease;
    text-decoration: none;
    display: block;
  }

  .card:hover,
  .list-card:hover {
    border-color: #00ffcc;
    transform: translateY(-3px);
  }

  .card-title {
    margin: 0 0 0.5rem;
    color: #7fffd4;
    font-size: 1.05rem;
  }

  .card-text {
    margin: 0;
    line-height: 1.6;
    color: #f1f1f1;
    opacity: 0.9;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;
  }

  .list-link {
    text-decoration: none;
    color: #7fffd4;
    font-weight: 600;
    display: inline-block;
  }

  .list-text {
    margin: 0.5rem 0 0;
    line-height: 1.6;
    color: #a8d5ff;
  }

  .callout {
    text-align: center;
    border-radius: 16px;
    background: radial-gradient(circle at top, rgba(0, 255, 204, 0.25), transparent 60%),
      #050505;
    border: 1px solid rgba(0, 255, 204, 0.3);
    padding: 2.25rem 2rem;
  }

  .callout-text {
    opacity: 0.92;
  }

  footer {
    padding-top: 2rem;
    padding-bottom: 2.5rem;
    text-align: center;
    font-size: 0.9rem;
    border-top: 1px solid rgba(0, 255, 204, 0.25);
    color: rgba(200, 220, 255, 0.8);
  }

  footer p {
    margin: 0;
  }

  footer p + p {
    margin-top: 0.65rem;
    color: rgba(148, 163, 184, 0.85);
  }

  @media (max-width: 640px) {
    .page-header {
      padding-top: 2rem;
    }

    .page-title {
      font-size: 2.1rem;
    }

    .page-shell main {
      padding-bottom: 3rem;
    }
  }
`

const highlights = [
  {
    title: "Stress test attuariali sui protocolli di lending",
    description:
      "Simulazioni su Aave per valutare resilienza del collaterale e rischio di liquidazione.",
    href: "/protocols/aave",
  },
  {
    title: "Guida operativa per LP professionali su Uniswap v3",
    description:
      "Metriche per gestire concentrazione della liquidità e contenere l'impermanent loss.",
    href: "/protocols/uniswap",
  },
  {
    title: "Checklist di governance per liquid staking",
    description:
      "Indicatori di decentralizzazione e sostenibilità delle fee su Lido Finance.",
    href: "/protocols/lido",
  },
]

const services = [
  {
    title: "Calcolatori attuariali",
    description:
      "Strumenti per stimare staking, rendite e Value at Risk con ipotesi personalizzate.",
    href: "/staking",
  },
  {
    title: "Protocolli monitorati",
    description:
      "Schede aggiornate su Aave, Lido, Curve, Uniswap e altri protocolli chiave.",
    href: "/defi",
  },
  {
    title: "Analisi comparativa DeFi/TradFi",
    description:
      "Benchmark quantitativi tra rendimento crypto, obbligazionario e prodotti assicurativi.",
    href: "/confronto",
  },
  {
    title: "Ricerca su misura",
    description:
      "Supporto a desk di tesoreria, family office e operatori istituzionali.",
    href: "/sponsor",
  },
]

export default function HomeAmp() {
  return (
    <>
      <Head>
        <title>Crypto-Attuario • Ricerca attuariale DeFi (AMP)</title>
        <meta
          name="description"
          content="Modelli attuariali, dati on-chain e benchmark per decisioni informate nella DeFi."
        />
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        ></script>
      </Head>

      <amp-auto-ads
        type="adsense"
        data-ad-client="ca-pub-8531177897035530"
      ></amp-auto-ads>

      <div className="page-shell">
        <header className="page-header">
          <h1 className="page-title">Crypto-Attuario</h1>
          <p className="page-subtitle">
            Modelli quantitativi per gestire rischio, rendimento e governance nella finanza
            decentralizzata.
          </p>
        </header>

        <main>
          <section className="section">
            <h2>Cosa trovi sulla piattaforma</h2>
            <div className="card-grid">
              {services.map((service) => (
                <a key={service.title} href={service.href} className="card">
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-text">{service.description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>Insight attuariali in evidenza</h2>
            <ul className="list">
              {highlights.map((item) => (
                <li key={item.title} className="list-card">
                  <a href={item.href} className="list-link">
                    {item.title}
                  </a>
                  <p className="list-text">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="callout">
            <h2>Resta aggiornato sulle metriche chiave</h2>
            <p className="card-text callout-text">
              Accedi alle dashboard DeFi e ai modelli attuariali per monitorare liquidità, leva e
              performance con un approccio istituzionale.
            </p>
          </section>
        </main>

        <footer>
          <p>© {new Date().getFullYear()} Crypto-Attuario</p>
          <p>Le informazioni hanno finalità educative e non costituiscono consulenza finanziaria.</p>
        </footer>
      </div>

      <style jsx global>{ampStyles}</style>
    </>
  )
}
