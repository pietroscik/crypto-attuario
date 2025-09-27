import Layout from "./Layout";

export default function ProtocolPage({ name, description, data, risks, comparison }) {
  return (
    <Layout>
      <section>
        <h2>{name} – Analisi Attuariale</h2>
        <p>{description}</p>

        <h3>📊 Dati principali</h3>
        <ul>
          <li>
            TVL: <span style={{ color: "#00ffcc" }}>{data.tvl}</span>
          </li>
          <li>Categoria: {data.category}</li>
          <li>Blockchain: {data.blockchains.join(", ")}</li>
        </ul>

        <h3>🔐 Indicatori di Rischio Attuariale</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "2rem",
          }}
        >
          <thead style={{ background: "#222", color: "#fff" }}>
            <tr>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Fattore</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Valutazione</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk, index) => (
              <tr key={index}>
                <td style={{ padding: "0.5rem", border: "1px solid #333" }}>{risk.fattore}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #333" }}>{risk.valutazione}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #333" }}>{risk.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>📈 Analisi comparativa</h3>
        <p>{comparison}</p>

        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Nota: i dati sono statici a titolo di esempio. Versioni future
          potranno integrare API come{" "}
          <a
            href="https://defillama.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#00ffcc" }}
          >
            DefiLlama
          </a>{" "}
          per TVL aggiornati in tempo reale.
        </p>
      </section>
    </Layout>
  );
}