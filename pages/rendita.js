import { useState } from "react";
import Layout from "../components/Layout";

export default function RenditaCrypto() {
  const [capital, setCapital] = useState(10000);
  const [rate, setRate] = useState(5); // % annuo
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState("annuale");
  const [posticipata, setPosticipata] = useState(true);

  const calculateRendita = () => {
    const i = rate / 100;
    const n =
      frequency === "annuale" ? years : years * 12; // anni o mesi
    const r =
      frequency === "annuale" ? i : i / 12; // interesse annuo o mensile

    // formula valore attuale di una rendita posticipata/anticipata
    let rendita =
      (capital * r) / (1 - Math.pow(1 + r, -n));

    if (!posticipata) {
      rendita = rendita / (1 + r); // rendita anticipata
    }

    return rendita.toFixed(2);
  };

  return (
    <Layout>
      <section>
        <h2>Calcolatore Rendita Crypto</h2>
        <p>
          Stima il valore di una rendita finanziata da capitale crypto
          investito.
        </p>

        <div style={{ maxWidth: "500px", marginBottom: "2rem" }}>
          <label>Capitale iniziale (USD):</label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
          />

          <label>Tasso annuo %:</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />

          <label>Durata (anni):</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />

          <label>Frequenza pagamento:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="annuale">Annuale</option>
            <option value="mensile">Mensile</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={posticipata}
              onChange={() => setPosticipata(!posticipata)}
            />
            Rendita posticipata (togli spunta = anticipata)
          </label>

          <h3>
            Rata stimata:{" "}
            <span style={{ color: "#00ffcc" }}>
              {frequency === "annuale" ? "$/anno" : "$/mese"}{" "}
              {calculateRendita()}
            </span>
          </h3>
        </div>
      </section>
    </Layout>
  );
}