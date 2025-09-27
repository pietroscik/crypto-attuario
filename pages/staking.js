import { useState } from "react";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StakingCalculator() {
  const [amount, setAmount] = useState(1000);
  const [apr, setApr] = useState(10);
  const [days, setDays] = useState(365);
  const [compound, setCompound] = useState(true);

  // Calcolo valore finale
  const calculate = () => {
    const rate = apr / 100;
    const t = days / 365;

    let finalAmount;
    if (compound) {
      finalAmount = amount * Math.pow(1 + rate / 365, days);
    } else {
      finalAmount = amount * (1 + rate * t);
    }

    return finalAmount.toFixed(2);
  };

  // Generazione dati per il grafico
  const generateChartData = () => {
    const rate = apr / 100;
    let data = [];

    for (let d = 0; d <= days; d += Math.ceil(days / 30)) {
      let value;
      if (compound) {
        value = amount * Math.pow(1 + rate / 365, d);
      } else {
        value = amount * (1 + rate * (d / 365));
      }
      data.push({ day: d, value: Number(value.toFixed(2)) });
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <Layout>
      <section className="hero">
        <h2>Calcolatore di Rendimento Staking</h2>
        <p>Inserisci i dati e scopri il rendimento stimato con grafico.</p>
      </section>

      <section className="features">
        <div style={{ flex: "1", padding: "1rem" }}>
          <label>Capitale iniziale (USD):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <label>APR % (tasso annuo):</label>
          <input
            type="number"
            value={apr}
            onChange={(e) => setApr(Number(e.target.value))}
          />

          <label>Durata (giorni):</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />

          <label>
            <input
              type="checkbox"
              checked={compound}
              onChange={() => setCompound(!compound)}
            />
            Interessi composti
          </label>

          <h3>
            Valore finale stimato:{" "}
            <span style={{ color: "#00ffcc" }}>${calculate()}</span>
          </h3>
        </div>

        <div style={{ width: "100%", height: 400, marginTop: "2rem" }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: "Giorni", position: "insideBottomRight", offset: -5 }} />
              <YAxis label={{ value: "Valore (USD)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#00ffcc" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Layout>
  );
}