import ProtocolPage from "../../components/ProtocolPage";

export default function Curve() {
  return (
    <ProtocolPage
      name="Curve Finance"
      description="Curve è un exchange decentralizzato (DEX) specializzato nello scambio efficiente di stablecoin e asset simili, riducendo lo slippage grazie al suo algoritmo AMM ottimizzato."
      data={{
        tvl: "$5.9B",
        category: "DEX (Stablecoin AMM)",
        blockchains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
      }}
      risks={[
        { fattore: "Volatilità asset", valutazione: "Bassa", note: "Focalizzato su stablecoin, riduce il rischio di prezzo" },
        { fattore: "Liquidità", valutazione: "Alta", note: "TVL elevato e pool molto profondi" },
        { fattore: "Smart Contract Risk", valutazione: "Medio-Alto", note: "Target frequente di exploit per l’alta liquidità" },
        { fattore: "Concentrazione TVL", valutazione: "Medio", note: "Molto concentrato sulle pool di stablecoin principali" },
      ]}
      comparison="Rispetto a Uniswap, Curve è molto più efficiente negli swap di stablecoin, ma è meno flessibile per altri token e più esposto a rischi di attacchi mirati."
    />
  );
}