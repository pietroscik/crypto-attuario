// data/protocolsData.js
const protocols = {
  aave: {
    name: "Aave",
    description:
      "Protocollo di lending e borrowing decentralizzato che permette agli utenti di prestare e prendere in prestito asset crypto.",
    data: {
      tvl: "$8.4B",
      category: "Lending & Borrowing",
      blockchains: ["Ethereum", "Polygon", "Avalanche", "Arbitrum"],
    },
    risks: [
      { fattore: "Volatilità collaterale", valutazione: "Alta", note: "Prestiti sovra-collateralizzati" },
      { fattore: "Liquidità", valutazione: "Alta", note: "Profondità significativa dei mercati" },
      { fattore: "Smart Contract Risk", valutazione: "Medio", note: "Codice complesso ma auditato" },
      { fattore: "Oracoli", valutazione: "Medio", note: "Dipendenza da Chainlink per i prezzi" },
    ],
    comparison:
      "Rispetto a Compound, Aave supporta più asset e funzionalità come flash loans.",
  },

  uniswap: {
    name: "Uniswap",
    description:
      "DEX basato su Automated Market Maker (AMM) che consente scambi permissionless di token ERC-20.",
    data: {
      tvl: "$4.2B",
      category: "DEX (AMM)",
      blockchains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    },
    risks: [
      { fattore: "Volatilità pool", valutazione: "Alta", note: "Impermanent loss per i liquidity provider" },
      { fattore: "Liquidità", valutazione: "Alta", note: "Pool con alti volumi di scambio" },
      { fattore: "Smart Contract Risk", valutazione: "Medio", note: "Target di exploit ma molto usato" },
      { fattore: "Concorrenza DEX", valutazione: "Medio", note: "Competizione con Curve, Sushi, Balancer" },
    ],
    comparison:
      "Rispetto a Curve, Uniswap è più versatile ma meno efficiente per stablecoin.",
  },

  curve: {
    name: "Curve Finance",
    description:
      "DEX specializzato nello scambio efficiente di stablecoin e asset simili, riducendo lo slippage grazie al suo algoritmo AMM ottimizzato.",
    data: {
      tvl: "$5.9B",
      category: "DEX (Stablecoin AMM)",
      blockchains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    },
    risks: [
      { fattore: "Volatilità asset", valutazione: "Bassa", note: "Stablecoin riducono il rischio di prezzo" },
      { fattore: "Liquidità", valutazione: "Alta", note: "Pool molto profondi" },
      { fattore: "Smart Contract Risk", valutazione: "Medio-Alto", note: "Target frequente di exploit" },
      { fattore: "Concentrazione TVL", valutazione: "Medio", note: "Molto esposto a poche stablecoin principali" },
    ],
    comparison:
      "Rispetto a Uniswap, Curve è molto più efficiente negli swap di stablecoin ma meno flessibile.",
  },

  lido: {
    name: "Lido Finance",
    description:
      "Protocollo leader nel liquid staking di ETH e altri asset, permette di ottenere token derivati come stETH.",
    data: {
      tvl: "$17.6B",
      category: "Liquid Staking",
      blockchains: ["Ethereum", "Polygon", "Moonbeam"],
    },
    risks: [
      { fattore: "Volatilità collaterale", valutazione: "Medio", note: "ETH esposto a drawdown" },
      { fattore: "Liquidità", valutazione: "Alta", note: "Mercati profondi per stETH" },
      { fattore: "Smart Contract Risk", valutazione: "Medio", note: "TVL alto lo rende un target" },
      { fattore: "Concentrazione stake", valutazione: "Alto", note: "Elevata centralizzazione dei validatori" },
    ],
    comparison:
      "Rispetto a RocketPool, Lido ha più liquidità ma rischi maggiori di centralizzazione.",
  },
};

export default protocols;
