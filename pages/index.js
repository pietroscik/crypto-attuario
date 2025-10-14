import Layout from "../components/Layout";
import protocols from "../data/protocolsData";

const services = [
  {
    title: "Ranking Attuariale DeFi",
    description:
      "Classifica risk-adjusted in tempo reale dei pool DeFi più performanti, basata su dati DefiLlama. Utilizza metriche tipo Sharpe ratio per valutare il rendimento normalizzato per la volatilità, identificando opportunità con il miglior profilo rischio-rendimento.",
    link: "/attuario",
    cta: "Vedi ranking",
    features: ["Auto-refresh 60s", "Sortable metrics", "Volatility analysis"]
  },
  {
    title: "Calcolatori attuariali",
    description:
      "Strumenti interattivi per simulare staking, rendite e Value at Risk con ipotesi personalizzate. Modella scenari di accumulo e distribuzione, proietta flussi cedolari futuri e stima la probabilità di perdite su orizzonti temporali definiti.",
    link: "/staking",
    cta: "Simula rendimento",
    features: ["Compound interest", "VaR analysis", "Custom scenarios"]
  },
  {
    title: "Protocolli monitorati",
    description:
      "Schede attuariali aggiornate su Aave, Lido, Curve, Uniswap e altri protocolli systemically relevant. Analisi approfondite di TVL, rischi operativi, smart contract audit, concentrazione della liquidità e metriche di governance.",
    link: "/defi",
    cta: "Apri la dashboard",
    features: ["4 major protocols", "Risk matrices", "Audit history"]
  },
  {
    title: "Analisi comparativa DeFi/TradFi",
    description:
      "Benchmark quantitativi tra rendimento crypto, obbligazionario e prodotti assicurativi tradizionali. Confronta APY DeFi vs tassi governativi, valuta premi al rischio e identifica inefficienze di mercato tra i due ecosistemi finanziari.",
    link: "/confronto",
    cta: "Confronta scenari",
    features: ["Yield comparison", "Risk premium", "Market efficiency"]
  },
  {
    title: "Ricerca su misura",
    description:
      "Supporto a desk di tesoreria, family office e operatori istituzionali per policy e governance DeFi. Costruzione di framework di risk management, stress testing su portafogli multi-protocollo e analisi di scenari macroeconomici.",
    link: "/sponsor",
    cta: "Richiedi briefing",
    features: ["Custom research", "Risk frameworks", "Stress testing"]
  },
];

const methodology = [
  {
    title: "Framework attuariale",
    detail:
      "Modelli basati su scenari, stress test di liquidità e metriche di solvibilità applicate alla DeFi. Utilizziamo tecniche di valutazione del rischio mutuate dalle compagnie assicurative e dai fondi pensione per quantificare l'esposizione e costruire buffer di capitale adeguati.",
    icon: "📊"
  },
  {
    title: "Data-driven",
    detail:
      "Integrazione di dataset on-chain, feed oracolari e serie storiche per misurare volatilità e correlazioni. Analisi quantitativa di oltre 10.000 pool DeFi con granularità oraria, tracciamento di liquidazioni, slippage effettivo e profondità del book.",
    icon: "📈"
  },
  {
    title: "Risk governance",
    detail:
      "Linee guida operative per comitati investimenti e policy interne focalizzate sul controllo del rischio. Framework di asset allocation tattica, regole di rebalancing automatico e protocolli di gestione della crisi per minimizzare drawdown inaspettati.",
    icon: "🛡️"
  },
];

const useCases = [
  {
    title: "Desk di tesoreria",
    detail:
      "Gestisci esposizioni su stablecoin e protocolli lending con metriche di sensitività e VaR giornalieri. Monitora il rischio di controparte, ottimizza l'allocazione della liquidità tra chain multiple e costruisci strategie di hedging dinamico con derivati on-chain.",
    icon: "🏦"
  },
  {
    title: "Family office",
    detail:
      "Costruisci strategie di rendita e successione utilizzando token staked e flussi cedolari DeFi. Pianifica distribuzione multi-generazionale del patrimonio crypto, ottimizza la fiscalità attraverso veicoli giuridici appropriati e massimizza yield sostenibile nel lungo periodo.",
    icon: "👥"
  },
  {
    title: "Operatori fintech",
    detail:
      "Integra servizi DeFi in prodotti retail mantenendo controlli su liquidità, KYC e compliance. Wrappa protocolli DeFi in interfacce user-friendly, gestisci custody segregata, implementa controlli AML/CTF e fornisci reporting regolamentare automatizzato.",
    icon: "💼"
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Definisci gli obiettivi",
    detail:
      "Quantifica orizzonte temporale, propensione al rischio e vincoli di liquidità del tuo mandato. Determina target di rendimento annuo, drawdown massimo tollerabile e necessità di redemption a breve termine per costruire un profilo di rischio chiaro e misurabile.",
  },
  {
    step: "02",
    title: "Seleziona gli strumenti",
    detail:
      "Sfrutta calcolatori, schede protocollo e benchmark per scegliere le strategie più coerenti. Confronta rendimenti risk-adjusted, valuta concentrazione della liquidità, analizza audit di sicurezza e costruisci un portafoglio diversificato cross-chain e cross-protocol.",
  },
  {
    step: "03",
    title: "Monitora e aggiorna",
    detail:
      "Imposta alert e revisioni periodiche con i nostri modelli per mantenere il portafoglio in equilibrio. Ricevi notifiche su eventi critici (liquidazioni, exploit, governance proposals), traccia metriche in real-time e adatta l'allocazione a condizioni di mercato mutevoli.",
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
          <p style={{ fontSize: "1.2rem", lineHeight: 1.8, maxWidth: "780px", marginBottom: "1.5rem" }}>
            Crypto-Attuario combina metodi attuariali, dati on-chain e controllo del rischio per supportare investitori,
            aziende e sviluppatori che operano nella finanza decentralizzata. Dalla costruzione di portafogli resilienti alla
            definizione di policy interne.
          </p>
          
          {/* Quick Stats */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
            gap: "1rem", 
            marginBottom: "1.5rem",
            maxWidth: "780px"
          }}>
            <div style={{ 
              padding: "1rem", 
              background: "#11161d", 
              borderRadius: "8px", 
              border: "1px solid #1f2d36" 
            }}>
              <div style={{ fontSize: "1.8rem", color: "#00ffcc", fontWeight: "bold" }}>10,000+</div>
              <div style={{ fontSize: "0.85rem", color: "#a0f0e0" }}>Pool DeFi analizzati</div>
            </div>
            <div style={{ 
              padding: "1rem", 
              background: "#11161d", 
              borderRadius: "8px", 
              border: "1px solid #1f2d36" 
            }}>
              <div style={{ fontSize: "1.8rem", color: "#00ffcc", fontWeight: "bold" }}>4</div>
              <div style={{ fontSize: "0.85rem", color: "#a0f0e0" }}>Protocolli monitorati</div>
            </div>
            <div style={{ 
              padding: "1rem", 
              background: "#11161d", 
              borderRadius: "8px", 
              border: "1px solid #1f2d36" 
            }}>
              <div style={{ fontSize: "1.8rem", color: "#00ffcc", fontWeight: "bold" }}>60s</div>
              <div style={{ fontSize: "0.85rem", color: "#a0f0e0" }}>Aggiornamento dati</div>
            </div>
          </div>
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
                <p style={{ lineHeight: 1.7, marginBottom: "1rem" }}>{service.description}</p>
                {service.features && (
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0, 
                    marginBottom: "1.25rem",
                    fontSize: "0.85rem",
                    color: "#a0f0e0"
                  }}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} style={{ marginBottom: "0.25rem" }}>
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                )}
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
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ lineHeight: 1.6 }}>{item.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <a className="cta-btn" href="/utilities/methodology">
              Esplora la documentazione completa
            </a>
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
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
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
            background: "linear-gradient(135deg, #101318 0%, #1a1f2e 100%)",
            borderRadius: "16px",
            padding: "2.5rem",
            border: "1px solid #1f2d36",
            boxShadow: "0 20px 40px -20px rgba(0, 255, 204, 0.3)",
          }}
        >
          <div style={{ maxWidth: "700px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📬</div>
            <h2 style={{ color: "#00ffcc", marginBottom: "0.75rem" }}>Ricevi la newsletter attuariale</h2>
            <p style={{ lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Un riepilogo mensile con aggiornamenti sui protocolli monitorati, dashboard di rischio e strumenti che stiamo
              sviluppando. Nessuno spam, solo insight azionabili per professionisti della finanza decentralizzata.
            </p>
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              color: "#a0f0e0"
            }}>
              <li style={{ marginBottom: "0.5rem" }}>✓ Analisi mensili di mercato e volatilità</li>
              <li style={{ marginBottom: "0.5rem" }}>✓ Nuovi protocolli e pool ad alto rendimento risk-adjusted</li>
              <li style={{ marginBottom: "0.5rem" }}>✓ Alert su eventi critici (exploit, governance, liquidazioni)</li>
              <li style={{ marginBottom: "0.5rem" }}>✓ Accesso anticipato a nuovi strumenti e calcolatori</li>
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <a className="cta-btn" href="mailto:ricerche@crypto-attuario.com">
                Iscriviti ora
              </a>
              <a className="cta-btn secondary" href="/blog">
                Leggi gli articoli
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Home;
