import Layout from "./Layout";
import ProtocolPageContent from "./ProtocolPage.jsx";

export default function ProtocolPage(props) {
  return (
    <Layout>
      <ProtocolPageContent {...props} />
    </Layout>
  );
}
