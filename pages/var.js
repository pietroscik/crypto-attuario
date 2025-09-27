import { useState } from "react";
import Layout from "../components/Layout";

export default function ValueAtRisk() {
  const [capital, setCapital] = useState(10000);
  const [mean, setMean] = useState(0); // rendimento medio % giornaliero
  const [volatility, setVolatility] = useState(5); // % giornaliera
  const [days, setDays] = useState(1);
  const [confidence, setConfidence] = useState(95);

  // quantili z per confidenza
  const zValues = {
    95: 1.65,
    99: 2.33,
  };

  const calculateVaR = () => {
    const mu = mean / 100;
    const sigma = volatility / 100;
    const z = zValues[confidence] || 1.65;

    // formula VaR parametric: capitale * (mu - z*sigma*sqrt(t))
    const t = Math.sqrt(days);
    const varValue = capital * (mu - z * sigma * t);

    return varValue.toFixed(2);
  };

  return (
    <Layout>
      <section>
        <h2>Calcolatore Value at Risk (VaR)</h2>
        <p>
          Stima della perdita massima attesa con metodo parametrico
          (assunzione: distribuzione normale dei rendimenti).
        </p>

        <div style={{ maxWidth: "500px", marginBottom: "2rem" }}>
          <label>Capitale iniziale (USD):</label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
          />

          <label>Rendimento medio giornaliero %:</label>
          <input
            type="number"
            value={mean}
            onChange={(e) => setMean(Number(e.target.value))}
          />

          <label>Volatilità giornaliera %:</label>
          <input
            type="number"
            value={volatility}
            onChange={(e) => setVolatility(Number(e.target.value))}
          />

          <label>Orizzonte (giorni):</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />

          <label>Livello di confidenza:</label>
          <select
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
          >
            <option value={95}>95%</option>
            <option value={99}>99%</option>
          </select>

          <h3>
            VaR stimato:{" "}
            <span style={{ color: "red" }}>
              ${Math.abs(calculateVaR())}
            </span>
          </h3>
        </div>
      </section>
    </Layout>
  );
}