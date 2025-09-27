import { useRouter } from "next/router";
import ProtocolPage from "../../components/ProtocolPage";
import protocols from "../../data/protocolsData";

export default function Protocol() {
  const router = useRouter();
  const { slug } = router.query;

  const protocol = protocols[slug];

  if (!protocol) {
    return <p>Protocollo non trovato</p>;
  }

  return (
    <ProtocolPage
      name={protocol.name}
      description={protocol.description}
      data={protocol.data}
      risks={protocol.risks}
      comparison={protocol.comparison}
    />
  );
}
