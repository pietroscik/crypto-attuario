import { useState } from "react";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ConfrontoDeFiTradFi() {
  const [capital, setCapital] = useState(10000);
  const [tassoTrad, setTassoTrad] = useState(2); // % annuo banca
  const [tassoDeFi, setTassoDeFi] = useState(8); // % annuo crypto
  const [anni, setAnni] = useState(10);

  const calcolaMontante = (capitale, tasso, anni) => {
    const i = tasso / 100;
    return capitale * Math.pow(1 + i, anni);
  };

  const generaDati = () => {
    const dati = [];
    for (let anno = 1; anno <= anni; anno++) {
      const trad = calcolaMontante(capital, tassoTrad, anno);
      const defi = calcolaMontante(capital, tassoDeFi, anno);
      dati.push({
        anno,
        TradFi: Number(trad.toFixed(2)),
        DeFi: Number(defi.toFixed(2)),
      });
    }
    return dati;
  };

  const finaleTrad = calcolaMontante(capital, tassoTrad, anni);
  const finaleDeFi = calcolaMontante(capital, tassoDeFi, anni);
  const differenza = finaleDeFi - finaleTrad;

  return (
    <Layout>
      <section>
        <h2>Confronto DeFi vs TradFi</h2>
        <p>
          Confronta il rendimento di un capitale investito in DeFi con un
          rendimento bancario tradizionale.
        </p>

        <div style={{ maxWidth: "500px", marginBottom: "2rem" }}>
          <label>Capitale iniziale (USD):</label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
          />

          <label>Tasso annuo TradFi %:</label>
          <input
            type="number"
            value={tassoTrad}
            onChange={(e) => setTassoTrad(Number(e.target.value))}
          />

          <label>Tasso annuo DeFi %:</label>
          <input
            type="number"
            value={tassoDeFi}
            onChange={(e) => setTassoDeFi(Number(e.target.value))}
          />

          <label>Durata (anni):</label>
          <input
            type="number"
            value={anni}
            onChange={(e) => setAnni(Number(e.target.value))}
          />

          <h3>
            Rendimento finale TradFi:{" "}
            <span style={{ color: "orange" }}>${finaleTrad.toFixed(2)}</span>
          </h3>
          <h3>
            Rendimento finale DeFi:{" "}
            <span style={{ color: "#00ffcc" }}>${finaleDeFi.toFixed(2)}</span>
          </h3>
          <h3>
            Differenza:{" "}
            <span style={{ color: "red" }}>${differenza.toFixed(2)}</span>
          </h3>
        </div>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={generaDati()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="anno"
                label={{ value: "Anni", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis
                label={{ value: "Valore (USD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="TradFi" stroke="orange" strokeWidth={2} />
              <Line type="monotone" dataKey="DeFi" stroke="#00ffcc" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Layout>
  );
}