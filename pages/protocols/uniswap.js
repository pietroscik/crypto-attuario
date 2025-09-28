import ProtocolPage from "../../components/ProtocolPage";
import protocols from "../../data/protocolsData";

const uniswap = protocols.uniswap;

export default function Uniswap() {
  const extendedDescription = `${uniswap.description} Le LP position possono essere personalizzate per range stretti, trasformando il protocollo in uno strumento di market making su misura.`;
  const extendedComparison = `${uniswap.comparison} Gli operatori devono pesare il rischio operativo legato a MEV, sandwich attack e al costo del ribilanciamento manuale o automatizzato.`;
  const pageInsights = [
    ...uniswap.insights,
    "Automatizza la gestione delle posizioni con bot di ribilanciamento e monitora il costo di gas vs rendimento.",
    "Analizza i flussi on-chain per individuare segnali di concentrazione delle fee in pochi pool dominanti.",
  ];

  return (
    <ProtocolPage
      name={uniswap.name}
      description={extendedDescription}
      data={uniswap.data}
      risks={uniswap.risks}
      comparison={extendedComparison}
      insights={pageInsights}
    />
  );
}
