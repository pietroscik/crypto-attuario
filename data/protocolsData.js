// data/protocolsData.js
const protocols = {
  aave: {
    name: "Aave",
    description:
      "Protocollo di lending e borrowing decentralizzato con gestione dinamica dei collaterali, tassi variabili/stabili e funzionalità avanzate come i flash loan. Il modello risk-based consente di ottimizzare capitale e liquidità in modo programmatico.",
    data: {
      tvl: "$8.4B",
      category: "Lending & Borrowing",
      blockchains: ["Ethereum", "Polygon", "Avalanche", "Arbitrum"],
    },
    risks: [
      {
        fattore: "Volatilità collaterale",
        valutazione: "Alta",
        note: "Prestiti sovra-collateralizzati: drawdown rapidi impattano sull'health factor",
      },
      {
        fattore: "Liquidità",
        valutazione: "Alta",
        note: "Mercati profondi e supporto istituzionale riducono il rischio di run bancari",
      },
      {
        fattore: "Smart Contract Risk",
        valutazione: "Medio",
        note: "Codice complesso ma auditato e battle-tested dal 2020",
      },
      {
        fattore: "Oracoli",
        valutazione: "Medio",
        note: "Dipendenza da Chainlink: eventuali disallineamenti possono attivare liquidazioni",
      },
    ],
    comparison:
      "Rispetto a Compound, Aave copre una gamma di asset più ampia, introduce cap prestito personalizzati e strumenti di gestione del rischio come i portali cross-chain. La governance deve bilanciare innovazione e stabilità del collaterale.",
    insights: [
      "Mantieni l'health factor ben sopra 1,2 per ammortizzare la volatilità improvvisa sui collaterali.",
      "Integra alert su Chainlink e sugli spread di liquidità per prevenire liquidazioni a cascata.",
      "Valuta l'impatto di GHO e dei moduli istituzionali sulla domanda di prestiti a tasso fisso.",
    ],
  },

  uniswap: {
    name: "Uniswap",
    description:
      "DEX basato su Automated Market Maker (AMM) che consente scambi permissionless di token ERC-20. L'architettura a pool concentrici (v3) permette market making capital-efficient e strategie di copertura su range specifici.",
    data: {
      tvl: "$4.2B",
      category: "DEX (AMM)",
      blockchains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    },
    risks: [
      {
        fattore: "Volatilità pool",
        valutazione: "Alta",
        note: "Impermanent loss elevato per liquidity provider su asset non correlati",
      },
      {
        fattore: "Liquidità",
        valutazione: "Alta",
        note: "Pool principali con volumi elevati e profondità multichain",
      },
      {
        fattore: "Smart Contract Risk",
        valutazione: "Medio",
        note: "Target di exploit ma supportato da bug bounty e auditing continuativo",
      },
      {
        fattore: "Concorrenza DEX",
        valutazione: "Medio",
        note: "Competizione serrata con Curve, Sushi, Balancer e aggregatori",
      },
    ],
    comparison:
      "Rispetto a Curve, Uniswap è più flessibile sugli asset e sulle fee, ma richiede una gestione attiva del rischio di esposizione. Le posizioni concentrate aumentano il rendimento atteso ma amplificano il rischio di slippage in scenari di shock.",
    insights: [
      "Calibra l'intervallo di liquidità in base alla volatilità storica e alle notizie macro.",
      "Utilizza coperture delta-neutral o stablecoin correlate per mitigare l'impermanent loss.",
      "Monitora i flussi verso DEX concorrenti per intercettare segnali di migrazione della liquidità.",
    ],
  },

  curve: {
    name: "Curve Finance",
    description:
      "DEX specializzato nello scambio efficiente di stablecoin e asset correlati, con un algoritmo AMM ottimizzato per minimizzare lo slippage. Il protocollo è spesso utilizzato come infrastruttura di base per strategie di liquidità istituzionali.",
    data: {
      tvl: "$5.9B",
      category: "DEX (Stablecoin AMM)",
      blockchains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    },
    risks: [
      {
        fattore: "Volatilità asset",
        valutazione: "Bassa",
        note: "Pool focalizzati su stablecoin: rischio prezzo limitato ma dipende dalla qualità delle peg",
      },
      {
        fattore: "Liquidità",
        valutazione: "Alta",
        note: "TVL elevato con incentivi CRV e gauge che attraggono depositi massivi",
      },
      {
        fattore: "Smart Contract Risk",
        valutazione: "Medio-Alto",
        note: "Target frequente di exploit: complessità dei pool factory e integrazioni esterne",
      },
      {
        fattore: "Concentrazione TVL",
        valutazione: "Medio",
        note: "Elevata esposizione a poche stablecoin sistemiche (USDT/USDC/DAI)",
      },
    ],
    comparison:
      "Rispetto a Uniswap, Curve offre efficienza superiore negli swap di stablecoin e rende sostenibili strategie di carry. Tuttavia, dipende da incentivi e governance token per mantenere liquidità competitiva.",
    insights: [
      "Stressa periodicamente il rischio di de-peg sugli asset sottostanti con scenari >1%.",
      "Valuta la sostenibilità degli incentivi CRV/veCRV nella redditività di lungo periodo.",
      "Integra controlli di controparte per i pool che includono wrapper o asset derivati complessi.",
    ],
  },

  lido: {
    name: "Lido Finance",
    description:
      "Protocollo leader nel liquid staking di ETH e altri asset: consente di ottenere token derivati (es. stETH) mantenendo esposizione al rendimento PoS. È diventato infrastruttura chiave per strategie leverage e collateralizzate.",
    data: {
      tvl: "$17.6B",
      category: "Liquid Staking",
      blockchains: ["Ethereum", "Polygon", "Moonbeam"],
    },
    risks: [
      {
        fattore: "Volatilità collaterale",
        valutazione: "Medio",
        note: "ETH resta esposto a drawdown: la leva sulle strategie di re-staking amplifica il rischio",
      },
      {
        fattore: "Liquidità",
        valutazione: "Alta",
        note: "Mercati profondi per stETH e presenza su principali lending market",
      },
      {
        fattore: "Smart Contract Risk",
        valutazione: "Medio",
        note: "TVL elevatissimo: necessita di controlli costanti e programma bug bounty",
      },
      {
        fattore: "Concentrazione stake",
        valutazione: "Alto",
        note: "Quota elevata dei validatori Ethereum: rischio sistemico e pressione regolatoria",
      },
    ],
    comparison:
      "Rispetto a Rocket Pool, Lido massimizza la liquidità e l'uso capital efficient ma concentra potere di governance. L'espansione verso il re-staking richiede metriche di monitoraggio dedicate per la resilienza del network.",
    insights: [
      "Monitora la divergenza di prezzo stETH/ETH per individuare pressioni di liquidità.",
      "Valuta la resilienza dei nodi operator partner e la loro distribuzione geografica.",
      "Considera strategie di hedging su futures ETH per stabilizzare il rendimento netto.",
    ],
  },
};

export default protocols;
