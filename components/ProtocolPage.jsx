export default function ProtocolPageContent({
  name,
  description,
  data = {},
  risks = [],
  comparison,
  insights = [],
}) {
  const metricsEntries = Object.entries(data);
  const blockchainCount = Array.isArray(data.blockchains)
    ? data.blockchains.length
    : typeof data.blockchains === "string" && data.blockchains.length > 0
    ? data.blockchains.split(",").length
    : 0;

  const summaryParts = [];
  if (data.tvl) summaryParts.push(`TVL stimato ${data.tvl}`);
  if (data.category) summaryParts.push(`segmento ${data.category.toLowerCase()}`);
  if (blockchainCount > 0)
    summaryParts.push(`presenza multi-chain su ${blockchainCount} network`);

  const insightItems =
    insights.length > 0
      ? insights
      : [
          `Monitora periodicamente la variazione del TVL di ${name} per individuare tempestivamente cali di fiducia del mercato.`,
          `Sottoponi i collaterali di ${name} a stress test di prezzo per valutare scenari di liquidazione improvvisa.`,
          `Verifica i processi di governance di ${name} prima di allocare capitali istituzionali di lungo periodo.`,
        ];

  return (
    <div
      style={{
        padding: "3rem 1.5rem 4rem",
        maxWidth: "960px",
        margin: "0 auto",
        color: "#f5f5f5",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.2rem",
            fontSize: "0.75rem",
            color: "#7fffd4",
          }}
        >
          Scheda attuariale
        </p>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#00ffcc" }}>
          {name}
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>{description}</p>
        {summaryParts.length > 0 && (
          <p style={{ marginTop: "1rem", color: "#a0f0e0" }}>
            {summaryParts.join(" • ")}
          </p>
        )}
      </header>

      {metricsEntries.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "#00ffcc" }}>Indicatori chiave</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {metricsEntries.map(([key, value]) => (
              <div
                key={key}
                style={{
                  background: "#101013",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 18px 35px -25px rgba(0, 255, 204, 0.75)",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.9rem",
                    letterSpacing: "0.05rem",
                    textTransform: "uppercase",
                    color: "#7fffd4",
                    marginBottom: "0.5rem",
                  }}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  {Array.isArray(value) ? value.join(", ") : value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem", color: "#00ffcc" }}>Analisi dei rischi</h2>
        <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
          La tabella seguente sintetizza i principali driver di rischio monitorati dal nostro
          laboratorio. Il punteggio qualitativo permette di confrontare rapidamente l’esposizione
          relativa tra protocolli simili.
        </p>
        <div style={{ overflowX: "auto", borderRadius: "12px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "480px",
            }}
          >
            <thead>
              <tr style={{ background: "#00ffcc22" }}>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>Fattore</th>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>Valutazione</th>
                <th style={{ padding: "0.85rem", textAlign: "left" }}>Note attuariali</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk, index) => (
                <tr key={`${risk.fattore}-${index}`} style={{ borderBottom: "1px solid #1f1f24" }}>
                  <td style={{ padding: "0.85rem" }}>{risk.fattore}</td>
                  <td style={{ padding: "0.85rem", color: "#00ffcc", fontWeight: 600 }}>
                    {risk.valutazione}
                  </td>
                  <td style={{ padding: "0.85rem", lineHeight: 1.5 }}>{risk.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem", color: "#00ffcc" }}>Come leggere il confronto</h2>
        <p style={{ lineHeight: 1.7 }}>{comparison}</p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem", color: "#00ffcc" }}>Spunti operativi</h2>
        <ul style={{ listStyle: "disc", marginLeft: "1.5rem", lineHeight: 1.7 }}>
          {insightItems.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.6rem" }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <div
          style={{
            background: "#11161d",
            borderRadius: "12px",
            padding: "1.5rem",
            border: "1px solid #1f2d36",
          }}
        >
          <h3 style={{ color: "#7fffd4", marginBottom: "0.75rem" }}>Costruisci il caso</h3>
          <p style={{ lineHeight: 1.6, marginBottom: "1rem" }}>
            Simula scenari di rendimento e drawdown incrociando i dati del protocollo con il
            nostro calcolatore di staking e il modello di Value at Risk.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a className="cta-btn" href="/staking">
              Calcolatore staking
            </a>
            <a className="cta-btn secondary" href="/var">
              Modello VaR
            </a>
          </div>
        </div>
        <div
          style={{
            background: "#11161d",
            borderRadius: "12px",
            padding: "1.5rem",
            border: "1px solid #1f2d36",
          }}
        >
          <h3 style={{ color: "#7fffd4", marginBottom: "0.75rem" }}>
            Monitora le variabili critiche
          </h3>
          <p style={{ lineHeight: 1.6, marginBottom: "1rem" }}>
            Utilizza il piano editoriale del nostro blog per seguire gli aggiornamenti di governance,
            i cambi di parametri e i trend di liquidità dei principali protocolli.
          </p>
          <a className="cta-btn" href="/blog">
            Vai al blog
          </a>
        </div>
      </section>
    </div>
  );
}
