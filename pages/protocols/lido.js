import ProtocolPage from "../../components/ProtocolPage";
import protocols from "../../data/protocolsData";

const lido = protocols.lido;

export default function Lido() {
  const extendedDescription = `${lido.description} Il DAO coordina validatori professionali e destina parte delle fee al tesoro per incentivare la sicurezza del network.`;
  const extendedComparison = `${lido.comparison} Gli investitori devono misurare l'impatto delle proposte di governance sul tasso di commissione e sul grado di centralizzazione dei nodi.`;
  const pageInsights = [
    ...lido.insights,
    "Valuta scenari di liquidity crunch in cui lo sconto di stETH rispetto a ETH supera il 1-2%.",
    "Analizza la distribuzione del rischio fra i nodi operator per ridurre dipendenze da singole entità.",
  ];

  return (
    <ProtocolPage
      name={lido.name}
      description={extendedDescription}
      data={lido.data}
      risks={lido.risks}
      comparison={extendedComparison}
      insights={pageInsights}
    />
  );
}
