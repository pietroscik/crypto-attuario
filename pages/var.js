import { useState } from "react";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export default function ValueAtRisk() {
  const [capital, setCapital] = useState(10000);
  const [mean, setMean] = useState(0); // rendimento medio % giornaliero
  const [volatility, setVolatility] = useState(5); // % giornaliera
  const [days, setDays] = useState(1);
  const [confidence, setConfidence] = useState(95);

  const zValues = {
    95: 1.65,
    99: 2.33,
  };

  const calculateVaR = () => {
    const mu = mean / 100;
    const sigma = volatility / 100;
    const z = zValues[confidence] || 1.65;
    const t = Math.sqrt(days);
    const varValue = capital * (mu - z * sigma * t);
    return varValue;
  };

  // Generazione dati distribuzione normale per grafico
  const generateChartData = () => {
    const mu = mean / 100;
    const sigma = volatility / 100;
    const t = Math.sqrt(days);

    const data = [];
    for (let x = -4; x <= 4; x += 0.2) {
      const prob =
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      data.push({
        rendimento: (x * 100).toFixed(2), // % rendimento
        probabilita: prob.toFixed(4),
      });
    }
    return data;
  };

  const varValue = calculateVaR();
  const chartData = generateChartData();

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
              ${Math.abs(varValue).toFixed(2)}
            </span>
          </h3>
        </div>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="rendimento"
                label={{
                  value: "Rendimento (%)",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Densità",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="probabilita"
                stroke="#00ffcc"
                strokeWidth={2}
                dot={false}
              />
              {/* Linea verticale per VaR */}
              <ReferenceLine
                x={(-confidence).toString()}
                stroke="red"
                label={{ value: `VaR ${confidence}%`, angle: -90, position: "insideTop" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Layout>
  );
}