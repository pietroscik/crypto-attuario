import Layout from "../components/Layout";

export default function DefiOverview() {
  return (
    <Layout>
      <section>
        <h2>Panoramica Mercato DeFi</h2>
        <p>
          La finanza decentralizzata (DeFi) è uno dei settori più dinamici
          dell’ecosistema crypto. Qui analizziamo i principali protocolli,
          i volumi e i rischi associati, con un approccio attuariale.
        </p>

        <h3>Principali Protocolli DeFi (esempio statico)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
          <thead style={{ background: "#222", color: "#fff" }}>
            <tr>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Protocollo</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>TVL ($)</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Categoria</th>
              <th style={{ padding: "0.5rem", border: "1px solid #333" }}>Rischio Attuariale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Aave</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>$8.5B</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Lending</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Medio</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Uniswap</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>$4.2B</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>DEX</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Alto (volatilità LP)</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Lido</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>$17.6B</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Staking</td>
              <td style={{ padding: "0.5rem", border: "1px solid #333" }}>Basso-Medio</td>
            </tr>
          </tbody>
        </table>

        <h3>Indicatori di Rischio</h3>
        <ul>
          <li>📉 Volatilità dei token sottostanti</li>
          <li>🔐 Rischio smart contract (audit, exploit storici)</li>
          <li>💧 Liquidità disponibile per prelievi</li>
          <li>⚖️ Concentrazione del TVL su pochi protocolli</li>
        </ul>

        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Nota: i dati qui riportati sono statici a titolo di esempio. In una
          versione avanzata si possono integrare API come{" "}
          <a href="https://defillama.com" target="_blank" rel="noreferrer" style={{ color: "#00ffcc" }}>
            DefiLlama
          </a>{" "}
          per aggiornamenti in tempo reale.
        </p>
      </section>
    </Layout>
  );
}