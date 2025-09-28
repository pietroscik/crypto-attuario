import ProtocolPage from "../../components/ProtocolPage";
import protocols from "../../data/protocolsData";

const aave = protocols.aave;

export default function Aave() {
  const extendedDescription = `${aave.description} L'introduzione della v3 ha reso possibili isolation mode per gli asset a maggiore rischio, conservative cap di esposizione e gestione granulare delle fee di liquidazione.`;
  const extendedComparison = `${aave.comparison} Per desk professionali è rilevante valutare anche la sostenibilità del Safety Module e la distribuzione dei delegati di governance che definiscono i parametri di rischio.`;
  const pageInsights = [
    ...aave.insights,
    "Configura alert sull'Health Factor e sul Loan-to-Value medio del portafoglio per prevenire liquidazioni a catena.",
    "Sfrutta le High Efficiency Mode per stablecoin e asset correlati quando cerchi leva conservativa.",
  ];

  return (
    <ProtocolPage
      name={aave.name}
      description={extendedDescription}
      data={aave.data}
      risks={aave.risks}
      comparison={extendedComparison}
      insights={pageInsights}
    />
  );
}
