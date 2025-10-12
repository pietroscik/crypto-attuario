import Layout from "../components/Layout";

const sections = [
  {
    title: "Modelli di valutazione del rischio",
    intro:
      "Quantificare il profilo rischio/rendimento è il primo passo per proporre strategie di remunerazione sostenibili nella DeFi. " +
      "Gli strumenti attuariali classici restano efficaci se adattati alla volatilità delle crypto.",
    items: [
      {
        name: "Value at Risk (VaR)",
        description:
          "Misura la perdita massima attesa entro un certo intervallo di confidenza su un orizzonte temporale definito.",
        implementation:
          "Combina approcci storici, parametrici e simulazioni Monte Carlo per catturare code grasse e stressare diversi scenari di mercato.",
        practical:
          "Caso pratico: treasury di un protocollo di lending che modula l'emissione di token reward limitando il VaR giornaliero al 3% del TVL.",
      },
      {
        name: "Conditional Value at Risk (CVaR)",
        description:
          "Stimare la perdita media oltre il VaR consente di valutare impatti estremi che nelle crypto si verificano con frequenza superiore alla finanza tradizionale.",
        implementation:
          "Integrare CVaR nei comitati di tesoreria DeFi per dimensionare buffer di capitale, soglie di alert e limiti di esposizione.",
        practical:
          "Caso pratico: pool di liquidità con stablecoin algoritmica che riserva il 15% delle fee in un fondo di garanzia quando il CVaR settimanale supera i limiti.",
      },
    ],
  },
  {
    title: "Algoritmi di ottimizzazione del portafoglio",
    intro:
      "Diversificare le fonti di rendimento richiede un framework quantitativo che bilanci volatilità, correlazioni e requisiti di liquidità.",
    items: [
      {
        name: "Modello media-varianza di Markowitz",
        description:
          "Seleziona le allocazioni efficienti massimizzando il rendimento atteso per un dato livello di rischio.",
        implementation:
          "Utilizzare serie storiche on-chain e off-chain per stimare matrici di covarianza, includendo costi di slippage e impermanent loss.",
        practical:
          "Caso pratico: ribilanciamento mensile di un vault DeFi che distribuisce 60% in lending, 25% in staking e 15% in strategie delta-neutral in base alla frontiera efficiente.",
      },
      {
        name: "Algoritmi evolutivi",
        description:
          "Approcci genetici esplorano combinazioni non lineari di asset e strategie di rendimento.",
        implementation:
          "Evolvere popolazioni di portafogli con fitness basata su Sharpe, Sortino e drawdown massimi per individuare soluzioni robuste.",
        practical:
          "Caso pratico: optimizer genetico che testa 200 combinazioni di farm cross-chain e seleziona quelle con payout stabile e correlazione inferiore a 0,4.",
      },
    ],
  },
  {
    title: "Modelli di previsione dei prezzi",
    intro:
      "Per remunerare correttamente gli utenti è cruciale anticipare variazioni di mercato e adeguare le soglie di incentivo.",
    items: [
      {
        name: "Reti neurali ricorrenti (RNN)",
        description:
          "Analizzano sequenze temporali tenendo conto delle dipendenze tra osservazioni consecutive.",
        implementation:
          "Addestrare LSTM o GRU su dataset multi-exchange, includendo volumi, funding rate e dati di sentiment.",
        practical:
          "Caso pratico: previsione rolling a 24 ore per adeguare i tassi di un prodotto di savings quando il modello prevede drawdown >5%.",
      },
      {
        name: "Modelli ARIMA",
        description:
          "Modelli autoregressivi che catturano trend, stagionalità e componenti stocastiche delle serie temporali.",
        implementation:
          "Applicare ARIMA come baseline interpretabile per stressare ipotesi di pricing degli incentivi e confrontare le previsioni ML.",
        practical:
          "Caso pratico: desk di risk management che confronta ARIMA e RNN per decidere l'aumento delle ricompense quando i volumi DEX calano oltre una deviazione standard.",
      },
    ],
  },
  {
    title: "Algoritmi di trading automatizzato",
    intro:
      "L'allocazione dinamica di capitali e incentivi può essere automatizzata per reagire a inefficienze di mercato in tempo reale.",
    items: [
      {
        name: "Strategie di arbitraggio",
        description:
          "Sfruttano differenze di prezzo tra exchange centralizzati e decentralizzati o tra pool con diversa composizione.",
        implementation:
          "Integrare bot che monitorano order book e pool AMM, con esecuzione automatica al superamento di soglie di spread predefinite.",
        practical:
          "Caso pratico: bot che reindirizza il 20% delle plusvalenze di arbitraggio in un fondo di reward per i liquidity provider che mantengono la posizione oltre 30 giorni.",
      },
      {
        name: "Trading basato su indicatori tecnici",
        description:
          "Indicatori come RSI e MACD generano segnali quantitativi per ottimizzare ingressi e uscite.",
        implementation:
          "Parametrizzare gli incentivi in base ai segnali tecnici, ad esempio modulando le reward quando RSI segnala ipercomprato o ipervenduto.",
        practical:
          "Caso pratico: strategia che aumenta del 10% i bonus di staking quando RSI <30 per stimolare raccolta durante fasi di pressione di vendita.",
      },
    ],
  },
  {
    title: "Modelli di incentivazione",
    intro:
      "Un programma di remunerazione efficace deve premiare la partecipazione di qualità senza compromettere la sostenibilità economica.",
    items: [
      {
        name: "Programmi di ricompensa dinamica",
        description:
          "Le ricompense si adattano ai comportamenti osservati e al contributo dell'utente.",
        implementation:
          "Calibrare moltiplicatori di reward con algoritmi predittivi che stimano churn, engagement e impatto sulla liquidità.",
        practical:
          "Caso pratico: loyalty program che attribuisce booster trimestrali agli utenti con retention >80% e attività di governance superiori alla media.",
      },
    ],
  },
  {
    title: "Machine learning per l'analisi del sentiment",
    intro:
      "Capire il sentiment della community aiuta ad anticipare variazioni di domanda e ad adeguare la comunicazione delle reward.",
    items: [
      {
        name: "Analisi del sentiment",
        description:
          "Tecniche NLP estraggono opinioni e aspettative da social media, forum e canali community.",
        implementation:
          "Utilizzare modelli transformer multilingua per classificare il sentiment e collegarlo a metriche on-chain, regolando incentivi e campagne informative.",
        practical:
          "Caso pratico: dashboard che riduce le reward destinate al referral program quando il sentiment negativo supera il 60% per tre giorni consecutivi.",
      },
    ],
  },
];

const bestPractices = [
  {
    title: "Data engineering integrato",
    description:
      "Consolidare feed on-chain, dati di mercato e segnali comportamentali in un data lake facilita la governance dei modelli; utilizzare pipeline automatizzate (ad es. Airflow) per garantire aggiornamenti orari e data quality.",
  },
  {
    title: "Stress test continui",
    description:
      "Validare le strategie di remunerazione con scenari what-if su volatilità estrema, congestione di rete e variazioni di liquidity mining, documentando gli impatti sul costo delle reward e sulla TVL.",
  },
  {
    title: "Misurazione dell'impatto",
    description:
      "Monitorare KPI come retention, TVL incrementale e costo di acquisizione per iterare rapidamente sugli incentivi; impostare dashboard condivise (Looker, Metabase) con alert automatici.",
  },
];

const caseStudies = [
  {
    title: "Vault di stablecoin con copertura del rischio",
    challenge:
      "Ridurre la volatilità del rendimento distribuendo incentivi in funzione della stabilità del collaterale.",
    approach:
      "Applicazione combinata di VaR giornaliero e CVaR settimanale per modulare le emissioni; quando i rischi aumentano, parte del reward viene spostato su bond tokenizzati a bassa volatilità.",
    outcome:
      "Riduzione del drawdown massimo dal 18% al 9% e crescita della retention dei depositanti dal 62% al 78% in tre mesi.",
  },
  {
    title: "Programma referral con AI per l'engagement",
    challenge:
      "Aumentare utenti attivi evitando frodi e account dormienti.",
    approach:
      "Modello di churn prediction che classifica i referrer; i bonus si attivano solo se i referral mantengono TVL >5000$ dopo 30 giorni. L'algoritmo suggerisce messaggi personalizzati basati sul sentiment social.",
    outcome:
      "Incremento del 35% degli utenti attivi mensili e riduzione del 22% dei bonus sprecati su account inattivi.",
  },
  {
    title: "Desk di market making automatizzato",
    challenge:
      "Stabilizzare la profondità del book su coppie a bassa liquidità.",
    approach:
      "Bot di arbitraggio fra CEX e DEX collegato a un optimizer genetico che seleziona pool con minore correlazione; l'RNN di prezzo adegua i range di concentrazione nelle liquidity position.",
    outcome:
      "Aumento del 27% della liquidità media e compressione dello spread medio da 1,8% a 0,9% in sei settimane.",
  },
];

const implementationPlan = [
  {
    title: "Definizione degli obiettivi di business",
    summary:
      "Allineare le iniziative quantitative con metriche economiche tangibili chiarisce aspettative e priorità per i team.",
    actions: [
      "Obiettivi chiari: fissare target misurabili su rendimento utenti, acquisizione e fidelizzazione.",
      "KPI: mappare indicatori come ROI, crescita del portafoglio e tassi di partecipazione ai programmi di incentivazione.",
    ],
  },
  {
    title: "Raccolta e preparazione dei dati",
    summary:
      "Dataset di qualità sono la base per calcoli affidabili e per addestrare modelli che reagiscano tempestivamente al mercato.",
    actions: [
      "Dati storici: acquisire prezzi, volumi e segnali comportamentali degli utenti da fonti on-chain e off-chain.",
      "Pulizia e normalizzazione: standardizzare formati, rimuovere outlier e armonizzare time frame per evitare distorsioni.",
      "Fonti dati: integrare API affidabili e feed in tempo reale per aggiornare i modelli senza ritardi.",
    ],
  },
  {
    title: "Sviluppo e testing dei modelli",
    summary:
      "Una fase iterativa consente di comparare approcci e misurare rapidamente l'impatto delle ipotesi quantitative.",
    actions: [
      "Prototipazione rapida: sviluppare versioni iniziali di modelli di rischio, pricing e trading con stack ML e statistica.",
      "Test A/B: confrontare strategie differenti di remunerazione o allocazione per evidenziarne resilienza e conversione.",
      "Validazione: applicare cross validation e backtesting per garantire che le soluzioni siano generalizzabili.",
    ],
  },
  {
    title: "Implementazione degli algoritmi di trading",
    summary:
      "L'automazione permette di eseguire le strategie approvate mantenendo controllo su rischio operativo e performance.",
    actions: [
      "Automazione: distribuire bot che eseguono arbitraggi e ribilanciamenti basandosi sui segnali dei modelli.",
      "Monitoraggio continuo: configurare alert e dashboard che rilevino derive rispetto agli obiettivi attesi.",
    ],
  },
  {
    title: "Sviluppo di programmi di incentivazione",
    summary:
      "Programmi premianti devono evolvere con il comportamento degli utenti e con la struttura dei costi.",
    actions: [
      "Programmi dinamici: aggiornare moltiplicatori e soglie di reward in base a profili di utilizzo e condizioni di mercato.",
      "Feedback degli utenti: raccogliere insight qualitativi e quantitativi per migliorare continuamente il design degli incentivi.",
    ],
  },
  {
    title: "Educazione e coinvolgimento degli utenti",
    summary:
      "Diffondere cultura del rischio e delle opportunità sostiene l'adozione delle nuove funzionalità.",
    actions: [
      "Eventi formativi: organizzare webinar, workshop e sessioni Q&A su rischi, opportunità e strumenti della piattaforma.",
      "Comunicazioni personalizzate: inviare newsletter e aggiornamenti mirati in base al comportamento e agli interessi degli utenti.",
    ],
  },
  {
    title: "Monitoraggio e ottimizzazione continua",
    summary:
      "L'analisi periodica dei risultati assicura che gli incentivi restino sostenibili ed efficaci.",
    actions: [
      "Analisi dei risultati: verificare regolarmente andamento dei KPI per identificare aree di miglioramento.",
      "Iterazione: aggiornare modelli e processi sfruttando i dati raccolti e le variazioni di contesto di mercato.",
    ],
  },
  {
    title: "Conformità e sicurezza",
    summary:
      "Gestire responsabilmente aspetti normativi e protezione dati tutela utenti e reputazione della piattaforma.",
    actions: [
      "Normative: monitorare i requisiti regolamentari e adeguare rapidamente policy e documentazione.",
      "Sicurezza dei dati: implementare controlli di sicurezza, crittografia e audit trail sulle informazioni sensibili.",
    ],
  },
];

export default function AttuarioNetworkStrategia() {
  return (
    <Layout>
      <main style={{ maxWidth: "940px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <header style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2rem",
              fontSize: "0.75rem",
              color: "#7fffd4",
            }}
          >
            Attuario.Network • Strategie di remunerazione
          </p>
          <h1 style={{ fontSize: "2.6rem", marginBottom: "1rem", color: "#00ffcc", lineHeight: 1.2 }}>
            Modelli e algoritmi avanzati per la remunerazione nella DeFi
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
            Integrare metriche attuariali, ottimizzazione quantitativa e machine learning permette di costruire programmi di
            ricompensa resilienti. Questa guida sintetizza gli approcci chiave per strutturare incentivi dinamici, mitigare
            il rischio e migliorare l'engagement sulla piattaforma attuario.network, e propone un piano operativo per
            implementare modelli e algoritmi in modo coordinato tra i team.
          </p>
        </header>

        <div style={{ display: "grid", gap: "2rem", marginBottom: "3.5rem" }}>
          {sections.map((section) => (
            <section
              key={section.title}
              style={{
                background: "#101318",
                borderRadius: "18px",
                padding: "2rem",
                border: "1px solid #1f2d36",
                boxShadow: "0 18px 32px -26px rgba(0, 255, 204, 0.4)",
              }}
            >
              <h2 style={{ color: "#00ffcc", fontSize: "1.6rem", marginBottom: "0.9rem" }}>{section.title}</h2>
              <p style={{ lineHeight: 1.7, marginBottom: "1.3rem" }}>{section.intro}</p>
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {section.items.map((item) => (
                  <article
                    key={item.name}
                    style={{
                      background: "#0f141b",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      border: "1px solid #1f2d36",
                    }}
                  >
                    <h3 style={{ color: "#7fffd4", marginBottom: "0.65rem", fontSize: "1.2rem" }}>{item.name}</h3>
                    <p style={{ lineHeight: 1.6, marginBottom: "0.75rem" }}>{item.description}</p>
                    <p style={{ lineHeight: 1.6, margin: 0 }}>
                      <strong style={{ color: "#00ffcc" }}>Implementazione consigliata:</strong> {item.implementation}
                    </p>
                    {item.practical && (
                      <p style={{ lineHeight: 1.6, margin: "0.6rem 0 0" }}>
                        <strong style={{ color: "#00ffcc" }}>Applicazione reale:</strong> {item.practical}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section
          style={{
            background: "#101721",
            borderRadius: "18px",
            padding: "2rem",
            border: "1px solid #1f2d36",
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ color: "#00ffcc", marginBottom: "0.85rem" }}>Casi pratici da replicare</h2>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {caseStudies.map((useCase) => (
              <article
                key={useCase.title}
                style={{
                  background: "#0f141b",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  border: "1px solid #1f2d36",
                  boxShadow: "0 18px 32px -28px rgba(0, 255, 204, 0.2)",
                }}
              >
                <h3 style={{ color: "#7fffd4", marginBottom: "0.75rem", fontSize: "1.3rem" }}>{useCase.title}</h3>
                <p style={{ lineHeight: 1.6, marginBottom: "0.6rem" }}>
                  <strong style={{ color: "#00ffcc" }}>Sfida:</strong> {useCase.challenge}
                </p>
                <p style={{ lineHeight: 1.6, marginBottom: "0.6rem" }}>
                  <strong style={{ color: "#00ffcc" }}>Approccio:</strong> {useCase.approach}
                </p>
                <p style={{ lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: "#00ffcc" }}>Risultato:</strong> {useCase.outcome}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#101721",
            borderRadius: "18px",
            padding: "2rem",
            border: "1px solid #1f2d36",
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ color: "#00ffcc", marginBottom: "0.85rem" }}>
            Implementazione efficace dei modelli e algoritmi
          </h2>
          <p style={{ lineHeight: 1.7, marginBottom: "1.2rem" }}>
            Per trasformare i framework quantitativi in risultati concreti è necessario un piano operativo condiviso da
            prodotto, data science e compliance. La roadmap seguente scandisce gli step prioritari per attuario.network,
            dalla definizione degli obiettivi fino al presidio normativo.
          </p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "1.75rem" }}>
            {implementationPlan.map((step, index) => (
              <li
                key={step.title}
                style={{
                  display: "grid",
                  gap: "0.6rem",
                  background: "#0f151f",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  border: "1px solid #1f2d36",
                  boxShadow: "0 18px 32px -28px rgba(127, 255, 212, 0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "999px",
                      background: "rgba(0, 255, 204, 0.12)",
                      color: "#00ffcc",
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </span>
                  <h3 style={{ margin: 0, fontSize: "1.35rem", color: "#7fffd4" }}>{step.title}</h3>
                </div>
                <p style={{ lineHeight: 1.6, margin: 0 }}>{step.summary}</p>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.6 }}>
                  {step.actions.map((action) => (
                    <li key={action} style={{ marginBottom: "0.35rem" }}>
                      {action}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section
          style={{
            background: "#101721",
            borderRadius: "18px",
            padding: "2rem",
            border: "1px solid #1f2d36",
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ color: "#00ffcc", marginBottom: "0.85rem" }}>Best practice operative</h2>
          <ul style={{ paddingLeft: "1.25rem", lineHeight: 1.7, margin: 0 }}>
            {bestPractices.map((item) => (
              <li key={item.title} style={{ marginBottom: "0.6rem" }}>
                <strong style={{ color: "#7fffd4" }}>{item.title}:</strong> {item.description}
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: "#101318",
            borderRadius: "18px",
            padding: "2rem",
            border: "1px solid #1f2d36",
          }}
        >
          <h2 style={{ color: "#00ffcc", marginBottom: "0.85rem" }}>Conclusione</h2>
          <p style={{ lineHeight: 1.7, marginBottom: "1.2rem" }}>
            L'integrazione di questi modelli consente di calibrare reward più efficienti, ridurre il rischio di over-incentivazione
            e potenziare la fidelizzazione della community. Documentare l'impatto e alimentare loop di feedback con i team di
            prodotto e rischio permette ad attuario.network di evolvere come punto di riferimento per strategie attuariali
            nella DeFi.
          </p>
          <p style={{ lineHeight: 1.7, margin: 0 }}>
            Passi successivi: costruire dashboard che traccino KPI di remunerazione, avviare progetti pilota su protocolli
            selezionati e condividere casi studio con la community per diffondere le migliori pratiche.
          </p>
        </section>
      </main>
    </Layout>
  );
}

