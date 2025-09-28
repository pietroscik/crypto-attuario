import Layout from "../components/Layout";
import protocols from "../data/protocolsData";

const services = [
  {
    title: "Calcolatori attuariali",
    description:
      "Strumenti interattivi per simulare staking, rendite e Value at Risk con ipotesi personalizzate.",
    link: "/staking",
    cta: "Simula rendimento",
  },
  {
    title: "Protocolli monitorati",
    description:
      "Schede attuariali aggiornate su Aave, Lido, Curve, Uniswap e altri protocolli systemically relevant.",
    link: "/defi",
    cta: "Apri la dashboard",
  },
  {
    title: "Analisi comparativa DeFi/TradFi",
    description:
      "Benchmark quantitativi tra rendimento crypto, obbligazionario e prodotti assicurativi tradizionali.",
    link: "/confronto",
    cta: "Confronta scenari",
  },
  {
    title: "Ricerca su misura",
    description:
      "Supporto a desk di tesoreria, family office e operatori istituzionali per policy e governance DeFi.",
    link: "/sponsor",
    cta: "Richiedi briefing",
  },
];

const methodology = [
  {
    title: "Framework attuariale",
    detail:
      "Modelli basati su scenari, stress test di liquidità e metriche di solvibilità applicate alla DeFi.",
  },
  {
    title: "Data-driven",
    detail:
      "Integrazione di dataset on-chain, feed oracolari e serie storiche per misurare volatilità e correlazioni.",
  },
  {
    title: "Risk governance",
    detail:
      "Linee guida operative per comitati investimenti e policy interne focalizzate sul controllo del rischio.",
  },
];

const useCases = [
  {
    title: "Desk di tesoreria",
    detail:
      "Gestisci esposizioni su stablecoin e protocolli lending con metriche di sensitività e VaR giornalieri.",
  },
  {
    title: "Family office",
    detail:
      "Costruisci strategie di rendita e successione utilizzando token staked e flussi cedolari DeFi.",
  },
  {
    title: "Operatori fintech",
    detail:
      "Integra servizi DeFi in prodotti retail mantenendo controlli su liquidità, KYC e compliance.",
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Definisci gli obiettivi",
    detail:
      "Quantifica orizzonte temporale, propensione al rischio e vincoli di liquidità del tuo mandato.",
  },
  {
    step: "02",
    title: "Seleziona gli strumenti",
    detail:
      "Sfrutta calcolatori, schede protocollo e benchmark per scegliere le strategie più coerenti.",
  },
  {
    step: "03",
    title: "Monitora e aggiorna",
    detail:
      "Imposta alert e revisioni periodiche con i nostri modelli per mantenere il portafoglio in equilibrio.",
  },
];

const blogHighlights = [
  {
    title: "Stress test attuariali sui protocolli di lending",
    excerpt: "Modelliamo scenari di liquidazione su Aave considerando oracoli e volatilità collateral.",
    link: "/protocols/aave",
  },
  {
    title: "Guida operativa per LP professionali su Uniswap v3",
    excerpt: "Strategie di copertura e ribilanciamento automatico per ridurre l'impermanent loss.",
    link: "/protocols/uniswap",
  },
  {
    title: "Checklist di governance per liquid staking",
    excerpt: "Metriche da monitorare su Lido Finance tra centralizzazione e sostenibilità delle fee.",
    link: "/protocols/lido",
  },
];

const featuredProtocols = ["aave", "uniswap", "curve", "lido"].map((slug) => ({
  slug,
  ...protocols[slug],
}));

function Home() {
  return (
    <Layout>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <section style={{ marginBottom: "3rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2rem",
              fontSize: "0.75rem",
              color: "#7fffd4",
            }}
          >
            Ricerca attuariale per la DeFi
          </p>
          <h1 style={{ fontSize: "3rem", margin: "0.75rem 0", color: "#00ffcc" }}>
            Modelli quantitativi per decisioni crypto informate
          </h1>
          <p style={{ fontSize: "1.2rem", lineHeight: 1.8, maxWidth: "780px" }}>
            Crypto-Attuario combina metodi attuariali, dati on-chain e controllo del rischio per supportare investitori,
            aziende e sviluppatori che operano nella finanza decentralizzata. Dalla costruzione di portafogli resilienti alla
            definizione di policy interne.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.75rem" }}>
            <a className="cta-btn" href="/confronto">
              Esplora comparativa DeFi/TradFi
            </a>
            <a className="cta-btn secondary" href="/sponsor">
              Parla con il team
            </a>
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Cosa trovi sulla piattaforma</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {services.map((service) => (
              <div
                key={service.title}
                style={{
                  background: "#101318",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  border: "1px solid #1f2d36",
                  boxShadow: "0 18px 35px -28px rgba(0, 255, 204, 0.6)",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.75rem", fontSize: "1.3rem" }}>
                  {service.title}
                </h3>
                <p style={{ lineHeight: 1.7, marginBottom: "1.25rem" }}>{service.description}</p>
                <a className="cta-btn secondary" href={service.link}>
                  {service.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>La nostra metodologia</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {methodology.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#11161d",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #1f2d36",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ lineHeight: 1.6 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Per chi lo abbiamo progettato</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {useCases.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#101318",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #1f2d36",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ lineHeight: 1.6 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Protocolli in osservazione</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {featuredProtocols.map((protocol) => (
              <div
                key={protocol.slug}
                style={{
                  background: "#11161d",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #1f2d36",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>{protocol.name}</h3>
                <p style={{ lineHeight: 1.6, marginBottom: "1rem" }}>{protocol.description}</p>
                <p style={{ fontSize: "0.85rem", color: "#a0f0e0", marginBottom: "1rem" }}>
                  TVL: {protocol.data.tvl} • Categoria: {protocol.data.category}
                </p>
                <a className="cta-btn" href={`/protocols/${protocol.slug}`}>
                  Vedi scheda attuariale
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Ultimi approfondimenti</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {blogHighlights.map((highlight) => (
              <div
                key={highlight.title}
                style={{
                  background: "#101318",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #1f2d36",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>{highlight.title}</h3>
                <p style={{ lineHeight: 1.6, marginBottom: "1rem" }}>{highlight.excerpt}</p>
                <a className="cta-btn secondary" href={highlight.link}>
                  Leggi ora
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#00ffcc", marginBottom: "1rem" }}>Come iniziare</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {onboardingSteps.map((step) => (
              <div
                key={step.step}
                style={{
                  background: "#11161d",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #1f2d36",
                }}
              >
                <p style={{ color: "#7fffd4", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{step.step}</p>
                <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>{step.title}</h3>
                <p style={{ lineHeight: 1.6 }}>{step.detail}</p>
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
          <h2 style={{ color: "#00ffcc", marginBottom: "0.75rem" }}>Ricevi la newsletter attuariale</h2>
          <p style={{ lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Un riepilogo mensile con aggiornamenti sui protocolli monitorati, dashboard di rischio e strumenti che stiamo
            sviluppando. Nessuno spam, solo insight azionabili per professionisti della finanza decentralizzata.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
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
