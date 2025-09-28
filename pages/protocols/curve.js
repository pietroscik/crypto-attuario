import ProtocolPage from "../../components/ProtocolPage";
import protocols from "../../data/protocolsData";

const curve = protocols.curve;

export default function Curve() {
  const extendedDescription = `${curve.description} La struttura dei gauge incentiva la migrazione di liquidità e rende indispensabile monitorare le emissioni CRV per valutare la sostenibilità dei rendimenti.`;
  const extendedComparison = `${curve.comparison} Occorre considerare il rischio di concentrazione del potere di voto e le dipendenze da asset sintetici presenti in alcuni metapool.`;
  const pageInsights = [
    ...curve.insights,
    "Verifica periodicamente lo stato delle peg (USDC/USDT/DAI) e del collateral delle pool algoritmiche.",
    "Analizza l'impatto del voto veCRV sul rendimento netto delle strategie di liquidity mining.",
  ];

  return (
    <ProtocolPage
      name={curve.name}
      description={extendedDescription}
      data={curve.data}
      risks={curve.risks}
      comparison={extendedComparison}
      insights={pageInsights}
    />
  );
}
