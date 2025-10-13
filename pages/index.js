import Layout from "../components/Layout";
import protocols from "../data/protocolsData";
import "../styles/home.css";

const heroMetrics = [
  { value: "12,500+", label: "Pool monitorati" },
  { value: "18 chain", label: "Copertura cross-chain" },
  { value: "< 60s", label: "Aggiornamento feed" },
];

const services = [
  {
    title: "Ranking attuariale DeFi",
    description:
      "Classifica dinamica dei pool con miglior profilo rischio/rendimento. Applichiamo metriche tipo Sharpe, Sortino e coverage ratio su dati DefiLlama aggiornati di continuo.",
    link: "/attuario",
    cta: "Apri il ranking",
    icon: "📊",
    features: [
      "Scoring risk-adjusted con refresh automatico",
      "Indicatori di volatilità e drawdown massimo",
      "Alert su anomalie di rendimento e liquidità",
    ],
  },
  {
    title: "Stress test di portafoglio",
    description:
      "Simulazioni multi-scenario su collaterali, stablecoin e strategie leverage. Valutiamo l'impatto di shock di mercato, variazioni degli oracoli e correlazioni tra asset.",
    link: "/var",
    cta: "Lancia uno stress test",
    icon: "🧮",
    features: [
      "Monte Carlo su volatilità storica",
      "Analisi di sensitività sugli haircut",
      "Report pronti per comitati investimenti",
    ],
  },
  {
    title: "Calcolatori di accumulo",
    description:
      "Modella piani di staking, rendita e pensionamento in chiave crypto. Confronta scenari con capitalizzazione composta, cashflow programmati e tassazione ipotetica.",
    link: "/staking",
    cta: "Simula rendimento",
    icon: "📈",
    features: [
      "Tassi variabili & capitalizzazione personalizzata",
      "Proiezioni mensili e breakdown cedole",
      "Esportazione dei risultati in PDF/CSV",
    ],
  },
  {
    title: "Osservatorio protocolli",
    description:
      "Schede attuariali per Aave, Lido, Curve, Uniswap e protocolli emergenti. Approfondiamo TVL, concentrazione operatori, audit, fattori di rischio e governance.",
    link: "/defi",
    cta: "Consulta le schede",
    icon: "🛡️",
    features: [
      "Heatmap dei fattori di rischio",
      "Cronologia exploit e audit",
      "Indicatori di liquidità cross-chain",
    ],
  },
  {
    title: "Benchmark DeFi vs TradFi",
    description:
      "Confronto quantitativo tra APY DeFi e tassi risk-free (Treasury, Euribor, polizze). Analizziamo il premio al rischio, la duration effettiva e la sostenibilità dei rendimenti.",
    link: "/confronto",
    cta: "Confronta scenari",
    icon: "⚖️",
    features: [
      "Spread su curve governative",
      "Analisi scenario bear/bull",
      "Dashboard comparativa interattiva",
    ],
  },
  {
    title: "Ricerca su misura",
    description:
      "Supporto a desk treasury, family office e assicurazioni per policy, governance e product design. Dalla definizione di KPI alla redazione di framework di risk management.",
    link: "/sponsor",
    cta: "Parla con noi",
    icon: "🤝",
    features: [
      "Workshop dedicati al tuo team",
      "Stress test regolamentari (ORSA, Solvency)",
      "Playbook operativi personalizzati",
    ],
  },
];

const methodology = [
  {
    title: "Framework attuariale",
    detail:
      "Costruiamo curve di sopravvivenza del capitale, analisi duration-liquidity e metriche di solvibilità applicate alla DeFi. Ogni protocollo viene classificato su più dimensioni di rischio.",
    icon: "📐",
  },
  {
    title: "Data-driven",
    detail:
      "Integriamo dataset on-chain, feed oracolari, metriche di chain analytics e fonti macro (tassi risk-free, inflazione) per elaborare viste complete sugli scenari di mercato.",
    icon: "🛰️",
  },
  {
    title: "Risk governance",
    detail:
      "Redigiamo linee guida per comitati investimenti, treasury DAO e operatori istituzionali. Definiamo policy di rebalancing, soglie di alert e processi di escalation.",
    icon: "🛡️",
  },
  {
    title: "Monitoraggio continuo",
    detail:
      "Automatizziamo il controllo di metriche critiche: health factor, collateral ratio, liquidazioni, concentrazione validatori, TVL per chain e segnali di stress del mercato.",
    icon: "⏱️",
  },
];

const useCases = [
  {
    title: "Desk di tesoreria",
    detail:
      "Gestisci esposizioni su stablecoin e protocolli lending con VaR giornaliero, metriche di sensitività e policy di collateral management integrate nel tuo treasury stack.",
    icon: "🏦",
  },
  {
    title: "Family office",
    detail:
      "Costruisci strategie di rendita e successione crypto con prodotti di liquid staking, stablecoin e assicurazioni parametriche. Pianifica cashflow multi-generazionali in modo efficiente.",
    icon: "👥",
  },
  {
    title: "Operatori fintech",
    detail:
      "Integra servizi DeFi in prodotti retail mantenendo controlli KYC/AML e misure di segregazione fondi. Offri reporting regolamentare automatizzato ai tuoi clienti.",
    icon: "💼",
  },
  {
    title: "DAO & protocolli",
    detail:
      "Supportiamo treasury decentralizzate nella definizione di metriche di rischio, stress test su emissioni token e politiche di incentivo sostenibili per la community.",
    icon: "🧩",
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Definisci obiettivi e vincoli",
    detail:
      "Mappa orizzonte temporale, drawdown massimo tollerabile, vincoli di liquidità e requisiti regolamentari per costruire un profilo rischio/rendimento chiaro.",
  },
  {
    step: "02",
    title: "Seleziona gli strumenti",
    detail:
      "Utilizza ranking, dashboard e calcolatori per individuare strategie coerenti con il mandato. Valuta diversificazione cross-chain, qualità degli audit e profondità di mercato.",
  },
  {
    step: "03",
    title: "Monitora e reagisci",
    detail:
      "Imposta alert personalizzati, schedule di revisione e metriche di early warning per mantenere il portafoglio allineato agli obiettivi e prevenire eventi avversi.",
  },
];

const blogHighlights = [
  {
    title: "Stress test attuariali sui protocolli di lending",
    excerpt: "Simuliamo shock di volatilità, variazioni oracolari e liquidazioni su Aave con modelli stocastici.",
    link: "/protocols/aave",
  },
  {
    title: "Guida operativa per LP professionali su Uniswap v3",
    excerpt: "Costruisci strategie di copertura dinamica e automatizza il rebalancing per ridurre l'impermanent loss.",
    link: "/protocols/uniswap",
  },
  {
    title: "Checklist di governance per liquid staking",
    excerpt: "Analizziamo KPI di decentralizzazione, performance e sostenibilità delle fee per Lido e competitor.",
    link: "/protocols/lido",
  },
  {
    title: "Blueprint assicurativo per le DAO",
    excerpt: "Framework per valutare polizze parametriche, fondi di garanzia e mutue on-chain.",
    link: "/blog",
  },
];

const utilityHighlights = [
  {
    title: "Yield screener in tempo reale",
    description:
      "Analisi dei pool più capitalizzati con breakdown APY base e reward, aggiornati con i dati pubblici di DeFiLlama.",
    link: "/utilities#yield-screener",
  },
  {
    title: "Monitor TVL e variazioni",
    description:
      "Dashboard sintetica con TVL e performance giornaliere/settimanali per i protocolli sistemici.",
    link: "/utilities#protocol-monitor",
  },
  {
    title: "Volatilità cross-asset",
    description:
      "Tracking di Bitcoin, Ethereum e Solana con variazione 24h per stimare la pressione di mercato.",
    link: "/utilities#volatility",
  },
];

const featuredProtocols = ["aave", "uniswap", "curve", "lido"].map((slug) => ({
  slug,
  ...protocols[slug],
}));

function SectionHeader({ kicker, title, description }) {
  return (
    <header className="section-header">
      {kicker && <p className="section-header__kicker">{kicker}</p>}
      <h2 className="section-header__title">{title}</h2>
      {description && <p className="section-header__description">{description}</p>}
    </header>
  );
}

function Home() {
  return (
    <Layout>
      <div className="home-wrapper">
        <section className="hero">
          <div>
            <p className="hero__kicker">Ricerca attuariale per la DeFi</p>
            <h1 className="hero__title">Modelli quantitativi per decisioni crypto informate</h1>
            <p className="hero__description">
              Crypto-Attuario combina tecniche attuariali, dati on-chain e risk engineering per supportare investitori,
              aziende e sviluppatori che operano nella finanza decentralizzata. Dalla costruzione di portafogli resilienti
              alla definizione di policy interne.
            </p>
            <div className="hero__metrics">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <span className="metric-card__value">{metric.value}</span>
                  <span className="metric-card__label">{metric.label}</span>
                </div>
              ))}
            </div>
            <div className="hero__actions">
              <a className="cta-btn" href="/utilities">
                Esplora gli strumenti live
              </a>
              <a className="cta-btn secondary" href="/sponsor">
                Parla con il team
              </a>
            </div>
          </div>
          <div className="tile tile--subtle">
            <h3 className="tile__title">Perché un attuario in DeFi?</h3>
            <p className="tile__description">
              Applichiamo modelli di solvibilità e gestione del rischio tipici di assicurazioni e fondi pensione alla
              complessità dei protocolli crypto. Monitoriamo metriche come collateral ratio, coverage, stress di liquidità e
              concentrazione degli operatori per fornire insight azionabili.
            </p>
            <ul className="split-panel__list">
              <li>➡️ Analisi indipendente basata su dati pubblici e oracoli certificati</li>
              <li>➡️ Report con metodologia trasparente e replicabile</li>
              <li>➡️ Supporto operativo e governance framework per team istituzionali</li>
            </ul>
            <div className="tag-row">
              <span className="tag">Solvency mindset</span>
              <span className="tag">Data integrity</span>
              <span className="tag">On-chain analytics</span>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Servizi principali"
            title="Cosa trovi sulla piattaforma"
            description="Strumenti, dashboard e consulenza per misurare, pianificare e monitorare il rischio nella finanza decentralizzata."
          />
          <div className="section-grid wide">
            {services.map((service) => (
              <article key={service.title} className="tile">
                <div className="tile__icon" aria-hidden>{service.icon}</div>
                <h3 className="tile__title">{service.title}</h3>
                <p className="tile__description">{service.description}</p>
                <ul className="feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a className="cta-btn secondary" href={service.link}>
                  {service.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Metodologia"
            title="Come valutiamo i protocolli"
            description="Un framework proprietario che integra modelli attuariali, dati on-chain e governance per ottenere una vista olistica del rischio."
          />
          <div className="section-grid">
            {methodology.map((item) => (
              <article key={item.title} className="tile tile--subtle">
                <div className="tile__icon" aria-hidden>{item.icon}</div>
                <h3 className="tile__title">{item.title}</h3>
                <p className="tile__description">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Stakeholder"
            title="Per chi lo abbiamo progettato"
            description="Soluzioni verticali per team che devono prendere decisioni rapide e documentate in contesti ad alto rischio operativo."
          />
          <div className="section-grid">
            {useCases.map((item) => (
              <article key={item.title} className="tile">
                <div className="tile__icon" aria-hidden>{item.icon}</div>
                <h3 className="tile__title">{item.title}</h3>
                <p className="tile__description">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Utility live"
            title="Strumenti basati su dati reali"
            description="Nuove dashboard che si aggiornano con feed pubblici per offrire una vista sempre aggiornata su rendimento, liquidità e volatilità."
          />
          <div className="section-grid">
            {utilityHighlights.map((item) => (
              <article key={item.title} className="tile tile--subtle">
                <h3 className="tile__title">{item.title}</h3>
                <p className="tile__description">{item.description}</p>
                <a className="cta-btn secondary" href={item.link}>
                  Vai allo strumento
                </a>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Osservatorio"
            title="Protocolli in osservazione"
            description="Schede attuariali aggiornate con metriche di TVL, categoria e principali chain supportate."
          />
          <div className="section-grid">
            {featuredProtocols.map((protocol) => (
              <article key={protocol.slug} className="tile tile--subtle">
                <h3 className="tile__title">{protocol.name}</h3>
                <p className="tile__description">{protocol.description}</p>
                <p className="tile__description">
                  TVL indicativo: {protocol.data.tvl} • Categoria: {protocol.data.category}
                </p>
                <div className="tag-row">
                  {protocol.data.blockchains.map((chain) => (
                    <span key={chain} className="tag">
                      {chain}
                    </span>
                  ))}
                </div>
                <a className="cta-btn" href={`/protocols/${protocol.slug}`}>
                  Vedi scheda attuariale
                </a>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="split-panel">
            <div>
              <SectionHeader
                kicker="Onboarding"
                title="Come iniziare"
                description="In tre step configuriamo profili di rischio, selezioniamo gli strumenti e impostiamo un monitoraggio continuo."
              />
            </div>
            <div className="timeline">
              {onboardingSteps.map((step) => (
                <article key={step.step} className="timeline__card">
                  <span className="timeline__step">{step.step}</span>
                  <h3 className="timeline__title">{step.title}</h3>
                  <p className="tile__description">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Insight"
            title="Ultimi approfondimenti"
            description="Approcci pratici per misurare e gestire il rischio attuariale nei protocolli decentralizzati."
          />
          <div className="blog-grid">
            {blogHighlights.map((highlight) => (
              <article key={highlight.title} className="blog-card">
                <h3 className="blog-card__title">{highlight.title}</h3>
                <p className="blog-card__excerpt">{highlight.excerpt}</p>
                <a className="cta-btn secondary" href={highlight.link}>
                  Leggi ora
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter-panel">
          <div style={{ fontSize: "2.5rem" }}>📬</div>
          <h2 className="section-header__title">Ricevi la newsletter attuariale</h2>
          <p className="section-header__description">
            Un riepilogo mensile con aggiornamenti sui protocolli monitorati, dashboard di rischio e strumenti che stiamo
            sviluppando. Nessuno spam, solo insight azionabili per professionisti della finanza decentralizzata.
          </p>
          <ul className="split-panel__list">
            <li>✓ Analisi mensili di mercato e volatilità</li>
            <li>✓ Nuovi protocolli e pool ad alto rendimento risk-adjusted</li>
            <li>✓ Alert su eventi critici (exploit, governance, liquidazioni)</li>
            <li>✓ Accesso anticipato a nuovi strumenti e calcolatori</li>
          </ul>
          <div className="hero__actions">
            <a className="cta-btn" href="mailto:ricerche@crypto-attuario.com">
              Iscriviti ora
            </a>
            <a className="cta-btn secondary" href="/blog">
              Leggi gli articoli
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Home;
