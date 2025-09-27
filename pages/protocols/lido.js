import ProtocolPage from "../../components/ProtocolPage";

export default function Lido() {
  return (
    <ProtocolPage
      name="Lido Finance"
      description="Lido è il principale protocollo di liquid staking, che permette agli utenti di mettere in staking i propri asset (come ETH) ricevendo token derivati (stETH) utilizzabili nella DeFi."
      data={{
        tvl: "$17.6B",
        category: "Liquid Staking",
        blockchains: ["Ethereum", "Polygon", "Solana (storico)", "Moonbeam"],
      }}
      risks={[
        { fattore: "Volatilità collaterale", valutazione: "Medio", note: "ETH resta esposto a drawdown di mercato" },
        { fattore: "Liquidità", valutazione: "Alta", note: "Mercati profondi per stETH e simili" },
        { fattore: "Smart Contract Risk", valutazione: "Medio", note: "Elevato TVL lo rende un target per exploit" },
        { fattore: "Concentrazione stake", valutazione: "Alto", note: "Elevata centralizzazione del validatore può essere un rischio sistemico" },
      ]}
      comparison="Rispetto a RocketPool, Lido ha TVL molto maggiore ma presenta rischi più elevati di concentrazione e centralizzazione del validatore."
    />
  );
}