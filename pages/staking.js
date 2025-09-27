import { useState } from "react";
import Layout from "../components/Layout";

export default function StakingCalculator() {
  const [amount, setAmount] = useState(1000);     // capitale iniziale
  const [apr, setApr] = useState(10);            // APR %
  const [days, setDays] = useState(365);         // durata in giorni
  const [compound, setCompound] = useState(true);

  const calculate = () => {
    const rate = apr / 100;
    const t = days / 365;

    let finalAmount;
    if (compound) {
      // interesse composto giornaliero
      finalAmount = amount * Math.pow(1 + rate / 365, days);
    } else {
      // interesse semplice
      finalAmount = amount * (1 + rate * t);
    }

    return finalAmount.toFixed(2);
  };

  return (
    <Layout>
      <section className="hero">
        <h2>Calcolatore di Rendimento Staking</h2>
        <p>Inserisci i dati e scopri il rendimento stimato.</p>
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
            Valore finale stimato: <span style={{ color: "#00ffcc" }}>${calculate()}</span>
          </h3>
        </div>
      </section>
    </Layout>
  );
}