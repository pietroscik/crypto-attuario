import Layout from "../../components/Layout";

export default function AaveProtocol() {
  return (
    <Layout>
      <section>
        <h2>Aave – Analisi Attuariale</h2>
        <p>
          <strong>Aave</strong> è uno dei principali protocolli di lending nella
          finanza decentralizzata (DeFi). Permette agli utenti di depositare asset
          crypto e guadagnare interessi, o prendere in prestito asset contro
          collaterale.
        </p>

        <h3>📊 Dati principali (esempio statico)</h3>
        <ul>
          <li>TVL: <span style={{ color: "#00ffcc" }}>$8.5B</span></li>
          <li>Categoria: Lending & Borrowing</li>
          <li>Blockchain: Ethereum, Polygon, Avalanche</li>
        </ul>

        <h3>🔐 Indicatori di Rischio Attuariale</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
          <thead style={{ background: "#222", color: "#fff" }}>
            <tr>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Fattore</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Valutazione</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Volatilità collaterale</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Alta</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Asset crypto soggetti a drawdown</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Liquidità</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Alta</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Ampio TVL e mercati multipli</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Smart Contract Risk</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Medio</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Audit regolari ma rischio exploit non nullo</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Concentrazione utenti</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Medio</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Dipendenza da grandi whale</td>
            </tr>
          </tbody>
        </table>

        <h3>📈 Analisi comparativa</h3>
        <p>
          Rispetto a protocolli simili (es. Compound), Aave mostra un TVL più alto
          e maggiore diversificazione cross-chain. Tuttavia, l’esposizione al rischio
          di liquidazioni in scenari di mercato estremi rimane significativa.
        </p>

        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Nota: i dati sono statici a titolo di esempio. Versioni future
          potranno integrare API come{" "}
          <a href="https://defillama.com" target="_blank" rel="noreferrer" style={{ color: "#00ffcc" }}>
            DefiLlama
          </a>{" "}
          per TVL aggiornati in tempo reale.
        </p>
      </section>
    </Layout>
  );
}