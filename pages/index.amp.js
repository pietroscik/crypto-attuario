import Head from "next/head"

export const config = { amp: true }

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
    </>
  )
}
