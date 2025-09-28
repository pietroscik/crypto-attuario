import Link from "next/link";
import Layout from "../components/Layout";
import AdBanner from "../components/AdBanner";

const STAT_CARDS = [
  {
    title: "+50 protocolli DeFi monitorati",
    text: "Dataset con metriche su TVL, rischio smart contract e liquidità.",
  },
  {
    title: "Modelli attuariali custom",
    text: "Simulazioni Monte Carlo e scenari stress test su asset digitali.",
  },
  {
    title: "Insight operativi",
    text: "Report settimanali su staking, stablecoin e strategie di rendimento.",
  },
];

const SERVICE_CARDS = [
  {
    icon: "🔐",
    title: "Calcolatore Staking",
    text: "Stima APR, APY e crescita composita per protocolli proof-of-stake.",
    href: "/staking",
  },
  {
    icon: "📊",
    title: "Planner di Rendita",
    text: "Crea un flusso di entrate passive con stablecoin e strategie DeFi.",
    href: "/rendita",
  },
  {
    icon: "📉",
    title: "Value at Risk",
    text: "Quantifica la perdita massima attesa e definisci le soglie di rischio.",
    href: "/var",
  },
  {
    icon: "🏦",
    title: "Piano Pensione Crypto",
    text: "Valuta sostenibilità e drawdown di un portafoglio basato su asset digitali.",
    href: "/pensione",
  },
  {
    icon: "⚖️",
    title: "DeFi vs TradFi",
    text: "Confronta rendimento aggiustato per il rischio tra mercati decentralizzati e tradizionali.",
    href: "/confronto",
  },
  {
    icon: "📈",
    title: "Radar Protocolli",
    text: "Schede dettagliate su Aave, Lido, Curve, Uniswap e altri protocolli emergenti.",
    href: "/defi",
  },
];

function Home() {
  return (
    <Layout
      title="Crypto-Attuario | Analisi attuariale per crypto e DeFi"
      description="Strumenti interattivi, modelli quantitativi e approfondimenti di finanza decentralizzata per investitori e professionisti."
      showAd={false}
    >
      <section className="hero">
        <div className="hero-content">
          <h2>Finanza Decentralizzata con Metodo Attuariale</h2>
          <p>
            Applichiamo statistiche, risk management e scienza attuariale per
            interpretare protocolli blockchain, stimare rendimenti sostenibili e
            mappare i rischi reali del mercato crypto.
          </p>
          <div className="hero-actions">
            <Link href="/staking" className="cta-btn">
              Avvia una simulazione
            </Link>
            <Link href="/blog" className="secondary-btn">
              Leggi gli insight
            </Link>
          </div>
        </div>
        <div className="stats-grid">
          {STAT_CARDS.map((card) => (
            <div key={card.title} className="card stat-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <AdBanner />

      <section className="services">
        <h2 className="section-title">Strumenti operativi</h2>
        <p className="section-subtitle">
          Dashboard e calcolatori per prendere decisioni basate sui dati.
        </p>
        <div className="grid">
          {SERVICE_CARDS.map((service) => (
            <Link key={service.title} href={service.href} className="card link-card">
              <span className="icon" aria-hidden="true">
                {service.icon}
              </span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="pill">Esplora</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="methodology">
        <h2 className="section-title">Metodo attuariale applicato alla DeFi</h2>
        <div className="grid two-columns">
          <div className="card">
            <h3>Analisi quantitativa</h3>
            <ul>
              <li>Distribuzioni di rendimento e scenari stress test multivariati.</li>
              <li>Metriche downside come VaR, CVaR e max drawdown.</li>
              <li>Monitoraggio on-chain di TVL, emissioni e liquidity coverage.</li>
            </ul>
          </div>
          <div className="card">
            <h3>Governance &amp; rischio operativo</h3>
            <ul>
              <li>Valutazione aggiornamenti di protocollo e modelli di incentivo.</li>
              <li>Analisi delle dipendenze da oracoli, bridge e custodian.</li>
              <li>Checklist attuariale per integrare protocolli in portafoglio.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="insights">
        <h2 className="section-title">Approfondimenti recenti</h2>
        <div className="grid">
          <article className="card">
            <h3>Strategie di rendimento sostenibile</h3>
            <p>
              Case study su stablecoin, liquid staking e rischio di controparte
              con esempi numerici e KPI attuariali.
            </p>
            <Link href="/blog" className="pill">
              Vai al blog
            </Link>
          </article>
          <article className="card">
            <h3>Report settimanale di mercato</h3>
            <p>
              Snapshot con indicatori di rischio, variazioni TVL e mappe di
              volatilità per le principali chain.
            </p>
            <Link href="/defi" className="pill">
              Consulta la dashboard
            </Link>
          </article>
          <article className="card">
            <h3>Toolkit professionale</h3>
            <p>
              Template scaricabili per risk memo, modelli ALM e reporting per
              team istituzionali.
            </p>
            <Link href="/sponsor" className="pill">
              Collabora con noi
            </Link>
          </article>
        </div>
      </section>

      <section className="newsletter">
        <h2>Iscriviti alla newsletter attuariale</h2>
        <p>
          Ricevi analisi quantitative, alert sui protocolli e guide pratiche per
          integrare la DeFi in modelli assicurativi e previdenziali.
        </p>
        <form className="newsletter-form">
          <input type="email" placeholder="La tua email professionale" required />
          <button type="submit">Iscriviti</button>
        </form>
        <small>Invio massimo 2 email al mese. Nessuno spam, solo ricerca.</small>
      </section>
    </Layout>
  );
}

export default Home;
