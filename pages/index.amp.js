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
        <style amp-custom="">{`
          :root {
            --bg: #000000;
            --bg-soft: rgba(0, 0, 0, 0.85);
            --border: rgba(148, 163, 184, 0.25);
            --accent: #22d3ee;
            --accent-soft: #7fffd4;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5f5;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 1) 60%, var(--bg) 100%);
            color: var(--text-primary);
            min-height: 100vh;
          }

          a {
            color: inherit;
          }

          .page-shell {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.95) 40%, var(--bg) 100%);
          }

          .page-header,
          main,
          footer {
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
            color: var(--accent);
            letter-spacing: -0.02em;
          }

          .page-subtitle {
            margin: 0;
            font-size: 1.1rem;
            line-height: 1.65;
            color: var(--text-secondary);
          }

          main {
            flex: 1 0 auto;
            padding-bottom: 3.5rem;
          }

          h2 {
            font-size: 1.75rem;
            color: var(--accent);
            margin-bottom: 0.75rem;
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
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.35rem;
            background: var(--bg-soft);
            box-shadow: 0 20px 40px -24px rgba(15, 23, 42, 0.9);
            transition: border-color 180ms ease, transform 180ms ease;
          }

          .card:hover,
          .list-card:hover {
            border-color: var(--accent);
            transform: translateY(-3px);
          }

          .card-title {
            margin: 0 0 0.5rem;
            color: var(--accent-soft);
            font-size: 1.05rem;
          }

          .card-text {
            margin: 0;
            line-height: 1.6;
            color: var(--text-primary);
            opacity: 0.88;
          }

          .callout-text {
            opacity: 0.92;
          }

          .list {
            list-style: none;
            padding: 0;
            margin: 1.5rem 0 0;
          }

          .list-link {
            text-decoration: none;
            color: var(--accent-soft);
            font-weight: 600;
            display: inline-block;
          }

          .list-text {
            margin: 0.5rem 0 0;
            line-height: 1.6;
            color: var(--text-secondary);
          }

          .callout {
            text-align: center;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95));
            border: 1px solid rgba(148, 163, 184, 0.2);
            padding: 2.25rem 2rem;
          }

          footer {
            padding-top: 2rem;
            padding-bottom: 2.5rem;
            text-align: center;
            font-size: 0.9rem;
            border-top: 1px solid rgba(15, 23, 42, 0.65);
            color: rgba(226, 232, 240, 0.8);
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

            main {
              padding-bottom: 3rem;
            }
          }
        `}</style>
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
