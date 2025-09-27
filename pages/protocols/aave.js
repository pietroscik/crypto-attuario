import ProtocolPage from "../../components/ProtocolPage";

export default function Uniswap() {
  return (
    <ProtocolPage
      name="Uniswap"
      description="Uniswap è il più grande exchange decentralizzato (DEX) basato su AMM, che consente scambi di token senza order book."
      data={{
        tvl: "$4.2B",
        category: "DEX (Automated Market Maker)",
        blockchains: ["Ethereum", "Polygon", "Arbitrum"],
      }}
      risks={[
        { fattore: "Impermanent Loss", valutazione: "Alto", note: "Forte esposizione per LP in mercati volatili" },
        { fattore: "Liquidità", valutazione: "Medio", note: "Molti pool ma concentrazione sugli asset top" },
        { fattore: "Smart Contract Risk", valutazione: "Medio", note: "Audit multipli ma rischio exploit sempre presente" },
        { fattore: "Concorrenza", valutazione: "Alto", note: "Competizione con altri DEX come Curve e Sushi" },
      ]}
      comparison="Rispetto a Curve, Uniswap offre maggiore varietà di pool ma più esposizione a impermanent loss."
    />
  );
}