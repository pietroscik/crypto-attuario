import Layout from "../components/Layout";
import { formatCurrency, formatPercent } from "../lib/format";
import "../styles/home.css";
import "../styles/utilities.css";

const PROTOCOL_SLUGS = [
  "aave-v3",
  "lido",
  "curve-dex",
  "uniswap-v3",
];

const PRICE_IDS = [
  { id: "bitcoin", label: "Bitcoin" },
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
];

function getDeltaClass(value) {
  if (typeof value !== "number") {
    return "";
  }
  if (value > 0) {
    return "text-positive";
  }
  if (value < 0) {
    return "text-negative";
  }
  return "";
}

function Utilities({ yieldPools, protocolMonitor, volatility, lastUpdated, errors }) {
  return (
    <Layout>
      <div className="utilities-wrapper">
        <header className="utilities-hero">
          <div>
            <p className="hero__kicker">Utility attuariali live</p>
            <h1 className="utilities-title">Dati real-time per decisioni basate sull'evidenza</h1>
            <p className="utilities-description">
              Dashboard interattive alimentate da feed pubblici. Analizziamo rendimento, TVL e volatilità per offrire un
              quadro operativo immediato. Aggiornato al {new Date(lastUpdated).toLocaleString("it-IT")}.
            </p>
            {errors.length > 0 && (
              <div className="utilities-alert">
                <strong>⚠️ Avviso:</strong> alcune sorgenti dati non sono disponibili al momento. Le sezioni mancanti sono
                state disattivate temporaneamente.
              </div>
            )}
          </div>
          <div className="tile tile--subtle">
            <h2 className="tile__title">Cosa puoi fare qui</h2>
            <ul className="split-panel__list">
              <li>• Confronta i pool con maggior TVL e APY effettivo</li>
              <li>• Controlla variazioni giornaliere e settimanali dei protocolli sistemici</li>
              <li>• Valuta la pressione di mercato tramite le oscillazioni di BTC, ETH e SOL</li>
            </ul>
            <div className="tag-row">
              <span className="tag">DeFiLlama</span>
              <span className="tag">CoinGecko</span>
              <span className="tag">Aggiornamento continuo</span>
            </div>
          </div>
        </header>

        {yieldPools.length > 0 && (
          <section id="yield-screener" className="utilities-section">
            <header className="section-header">
              <p className="section-header__kicker">Yield Screener</p>
              <h2 className="section-header__title">Pool con più capitale allocato</h2>
              <p className="section-header__description">
                Classifica basata su TVL e rendimento annualizzato. Gli APY includono eventuali componenti base e reward. I
                dati sono forniti da DeFiLlama.
              </p>
            </header>
            <div className="data-table" role="table" aria-label="Pool DeFi per TVL">
              <div className="data-table__row data-table__row--head" role="row">
                <div className="data-table__cell" role="columnheader">
                  Pool
                </div>
                <div className="data-table__cell" role="columnheader">
                  Chain
                </div>
                <div className="data-table__cell" role="columnheader">
                  TVL
                </div>
                <div className="data-table__cell" role="columnheader">
                  APY
                </div>
                <div className="data-table__cell" role="columnheader">
                  Componenti
                </div>
              </div>
              {yieldPools.map((pool) => {
                const hasReward = typeof pool.apyReward === "number";
                return (
                  <div key={pool.id} className="data-table__row" role="row">
                    <div className="data-table__cell" role="cell">
                      <strong>{pool.project}</strong>
                      <span className="data-table__muted">{pool.symbol}</span>
                    </div>
                    <div className="data-table__cell" role="cell">
                      {pool.chain}
                    </div>
                    <div className="data-table__cell" role="cell">
                      {formatCurrency(pool.tvlUsd)}
                    </div>
                    <div className="data-table__cell" role="cell">
                      <span className={`badge ${pool.apy >= 5 ? "badge--positive" : ""}`}>
                        {formatPercent(pool.apy, { decimals: 2, sign: false })}
                      </span>
                    </div>
                    <div className="data-table__cell" role="cell">
                      <span className="data-table__muted">
                        Base {formatPercent(pool.apyBase, { decimals: 2, sign: false })}
                      </span>
                      {hasReward ? (
                        <span className="data-table__muted">
                          {" "}• Reward {formatPercent(pool.apyReward, { decimals: 2, sign: false })}
                        </span>
                      ) : (
                        <span className="data-table__muted"> • Reward n/d</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {protocolMonitor.length > 0 && (
          <section id="protocol-monitor" className="utilities-section">
            <header className="section-header">
              <p className="section-header__kicker">Protocol monitor</p>
              <h2 className="section-header__title">TVL e variazioni dei protocolli chiave</h2>
              <p className="section-header__description">
                Snapshot dei protocolli maggiormente seguiti dalla nostra ricerca. Valutiamo la dinamica del TVL e la variazione
                giornaliera/settimanale per individuare trend di rischio.
              </p>
            </header>
            <div className="section-grid">
              {protocolMonitor.map((protocol) => (
                <article key={protocol.slug} className="tile">
                  <h3 className="tile__title">{protocol.name}</h3>
                  <p className="tile__description">Categoria: {protocol.category}</p>
                  <div className="utilities-metric">
                    <span className="utilities-metric__label">TVL stimato</span>
                    <span className="utilities-metric__value">{formatCurrency(protocol.tvl)}</span>
                  </div>
                  <div className="utilities-metric utilities-metric--spread">
                    <div>
                      <span className="utilities-metric__label">24h</span>
                    <span className={`utilities-metric__value ${getDeltaClass(protocol.change1d)}`}>
                      {formatPercent(protocol.change1d)}
                    </span>
                  </div>
                  <div>
                    <span className="utilities-metric__label">7d</span>
                    <span className={`utilities-metric__value ${getDeltaClass(protocol.change7d)}`}>
                      {formatPercent(protocol.change7d)}
                    </span>
                  </div>
                </div>
                  <p className="data-table__muted">Fonte: DeFiLlama (aggiornamento giornaliero)</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {volatility.length > 0 && (
          <section id="volatility" className="utilities-section">
            <header className="section-header">
              <p className="section-header__kicker">Volatilità cross-asset</p>
              <h2 className="section-header__title">Movimenti 24h dei principali asset</h2>
              <p className="section-header__description">
                Utilizziamo i dati di CoinGecko per monitorare la pressione di mercato su asset guida. I valori sono espressi in
                USD e variazione percentuale nelle ultime 24 ore.
              </p>
            </header>
            <div className="volatility-grid">
              {volatility.map((asset) => (
                <article key={asset.id} className="tile tile--subtle">
                  <h3 className="tile__title">{asset.label}</h3>
                  <div className="utilities-metric">
                    <span className="utilities-metric__label">Prezzo spot</span>
                    <span className="utilities-metric__value">{formatCurrency(asset.price, { compact: false })}</span>
                  </div>
                  <div className="utilities-metric">
                    <span className="utilities-metric__label">Var. 24h</span>
                    <span className={`utilities-metric__value ${getDeltaClass(asset.change24h)}`}>
                      {formatPercent(asset.change24h)}
                    </span>
                  </div>
                  <p className="data-table__muted">Ultimo aggiornamento: {asset.lastUpdated}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const errors = [];
  let yieldPools = [];
  let protocolMonitor = [];
  let volatility = [];
  const lastUpdated = new Date().toISOString();

  try {
    const [protocolsRes, yieldsRes, pricesRes] = await Promise.all([
      fetch("https://api.llama.fi/protocols"),
      fetch("https://yields.llama.fi/pools"),
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${PRICE_IDS.map((asset) => asset.id).join(",")}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
      ),
    ]);

    if (!protocolsRes.ok) {
      errors.push("protocols");
    } else {
      const protocolsData = await protocolsRes.json();
      protocolMonitor = PROTOCOL_SLUGS.map((slug) => {
        const snapshot = protocolsData.find((item) => item.slug === slug);
        if (!snapshot) {
          errors.push(`protocol-${slug}`);
          return null;
        }

        return {
          slug,
          name: snapshot.name ?? slug,
          tvl: snapshot.tvl ?? null,
          change1d: snapshot.change_1d ?? null,
          change7d: snapshot.change_7d ?? null,
          category: snapshot.category ?? "-",
        };
      }).filter(Boolean);
    }

    if (!yieldsRes.ok) {
      errors.push("yields");
    } else {
      const yieldData = await yieldsRes.json();
      yieldPools = (yieldData?.data ?? [])
        .filter((pool) => typeof pool.tvlUsd === "number" && pool.tvlUsd > 5_000_000)
        .sort((a, b) => b.tvlUsd - a.tvlUsd)
        .slice(0, 8)
        .map((pool) => ({
          id: pool.pool,
          project: pool.project,
          chain: pool.chain,
          symbol: pool.symbol,
          apy: pool.apy,
          apyBase: pool.apyBase,
          apyReward: pool.apyReward,
          tvlUsd: pool.tvlUsd,
        }));
    }

    if (!pricesRes.ok) {
      errors.push("prices");
    } else {
      const priceData = await pricesRes.json();
      volatility = PRICE_IDS.map((asset) => ({
        ...asset,
        price: priceData?.[asset.id]?.usd ?? null,
        change24h: priceData?.[asset.id]?.usd_24h_change ?? null,
        lastUpdated: priceData?.[asset.id]?.last_updated_at
          ? new Date(priceData[asset.id].last_updated_at * 1000).toLocaleString("it-IT")
          : "n/d",
      }));
    }
  } catch (error) {
    errors.push("generic");
  }

  return {
    props: {
      yieldPools,
      protocolMonitor,
      volatility,
      lastUpdated,
      errors,
    },
  };
}

export default Utilities;
