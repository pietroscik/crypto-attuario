export default function ProtocolPage({ name, description, data, risks, comparison }) {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Titolo */}
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#00ffcc" }}>
        {name}
      </h1>

      {/* Descrizione */}
      <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2rem" }}>
        {description}
      </p>

      {/* Dati principali */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            style={{
              background: "#111",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 0 8px rgba(0, 255, 204, 0.3)",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", color: "#00ffcc" }}>
              {key.toUpperCase()}
            </h3>
            <p>{Array.isArray(value) ? value.join(", ") : value}</p>
          </div>
        ))}
      </section>

      {/* Tabella dei rischi */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", color: "#00ffcc" }}>Valutazione dei Rischi</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#00ffcc22" }}>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Fattore</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Valutazione</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "0.75rem" }}>{r.fattore}</td>
                <td style={{ padding: "0.75rem", color: "#00ffcc" }}>{r.valutazione}</td>
                <td style={{ padding: "0.75rem" }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Confronto */}
      <section>
        <h2 style={{ marginBottom: "1rem", color: "#00ffcc" }}>Confronto</h2>
        <p style={{ lineHeight: "1.6" }}>{comparison}</p>
      </section>
    </div>
  );
}
export default function ProtocolPage({ name, description, data, risks, comparison }) {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Titolo */}
      <h1>{name}</h1>

      {/* Descrizione */}
      <p style={{ marginBottom: "2rem" }}>{description}</p>

      {/* Dati principali */}
      <div className="grid" style={{ marginBottom: "2rem" }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="card">
            <h3>{key.toUpperCase()}</h3>
            <p>{Array.isArray(value) ? value.join(", ") : value}</p>
          </div>
        ))}
      </div>

      {/* Tabella dei rischi */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Valutazione dei Rischi</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Fattore</th>
              <th>Valutazione</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r, i) => (
              <tr key={i}>
                <td>{r.fattore}</td>
                <td style={{ color: "#00ffcc" }}>{r.valutazione}</td>
                <td>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Confronto */}
      <section>
        <h2>Confronto</h2>
        <p>{comparison}</p>
      </section>
    </div>
  );
}

