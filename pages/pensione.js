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

export default function PensioneCrypto() {
  const [contributo, setContributo] = useState(200); // USD/mese
  const [anni, setAnni] = useState(30);
  const [tasso, setTasso] = useState(5); // % annuo
  const [rendimento, setRendimento] = useState("composto");

  // Calcolo capitale finale
  const calcolaCapitale = () => {
    const i = tasso / 100 / 12; // tasso mensile
    const n = anni * 12; // mesi totali

    let montante = 0;
    if (rendimento === "composto") {
      // formula della rendita posticipata (montante contributi)
      montante = contributo * ((Math.pow(1 + i, n) - 1) / i);
    } else {
      // semplice accumulo senza interessi composti
      montante = contributo * n * (1 + i * n);
    }

    return montante.toFixed(2);
  };

  // Calcolo rendita mensile stimata (20 anni)
  const calcolaRendita = () => {
    const montante = parseFloat(calcolaCapitale());
    const n = 20 * 12; // durata erogazione: 20 anni
    const i = tasso / 100 / 12;

    const rata = (montante * i) / (1 - Math.pow(1 + i, -n));
    return rata.toFixed(2);
  };

  // Generazione dati per grafico accumulo
  const generaDati = () => {
    const dati = [];
    const i = tasso / 100 / 12;

    for (let anno = 1; anno <= anni; anno++) {
      const n = anno * 12;
      let montante =
        contributo * ((Math.pow(1 + i, n) - 1) / i);
      dati.push({ anno, valore: Number(montante.toFixed(2)) });
    }
    return dati;
  };

  const chartData = generaDati();

  return (
    <Layout>
      <section>
        <h2>Simulatore Pensionistico Crypto</h2>
        <p>
          Calcola il capitale accumulato con versamenti mensili in
          stablecoin e la rendita stimata.
        </p>

        <div style={{ maxWidth: "500px", marginBottom: "2rem" }}>
          <label>Contributo mensile (USD):</label>
          <input
            type="number"
            value={contributo}
            onChange={(e) => setContributo(Number(e.target.value))}
          />

          <label>Durata (anni):</label>
          <input
            type="number"
            value={anni}
            onChange={(e) => setAnni(Number(e.target.value))}
          />

          <label>Tasso annuo %:</label>
          <input
            type="number"
            value={tasso}
            onChange={(e) => setTasso(Number(e.target.value))}
          />

          <label>Tipo rendimento:</label>
          <select
            value={rendimento}
            onChange={(e) => setRendimento(e.target.value)}
          >
            <option value="composto">Interesse composto</option>
            <option value="semplice">Interesse semplice</option>
          </select>

          <h3>
            Capitale accumulato:{" "}
            <span style={{ color: "#00ffcc" }}>
              ${calcolaCapitale()}
            </span>
          </h3>

          <h3>
            Rendita mensile stimata (20 anni):{" "}
            <span style={{ color: "orange" }}>
              ${calcolaRendita()}
            </span>
          </h3>
        </div>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="anno" label={{ value: "Anni", position: "insideBottomRight", offset: -5 }} />
              <YAxis label={{ value: "Valore (USD)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="valore" stroke="#00ffcc" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Layout>
  );
}