import ProtocolPage from "../../components/ProtocolPage";

export default function Aave() {
  return (
    <ProtocolPage
      name="Aave"
      description="Aave è un protocollo di lending e borrowing non-custodial che permette di depositare asset crypto a garanzia per generare rendimento o ottenere liquidità."
      data={{
        tvl: "$8.5B",
        category: "Lending & Borrowing",
        blockchains: ["Ethereum", "Polygon", "Avalanche", "Arbitrum"],
      }}
      risks={[
        { fattore: "Volatilità collaterale", valutazione: "Alta", note: "Prestiti sovra-collateralizzati soggetti a liquidazioni" },
        { fattore: "Liquidità", valutazione: "Alta", note: "Mercati profondi e ampia disponibilità di asset" },
        { fattore: "Smart Contract Risk", valutazione: "Medio", note: "Codice complesso ma auditato e battle-tested" },
        { fattore: "Dipendenza oracoli", valutazione: "Medio", note: "Feed Chainlink fondamentali per i prezzi" },
      ]}
      comparison="Rispetto a Compound, Aave supporta più asset, mercati isolati e funzionalità avanzate come i flash loan."
    />
  );
}
