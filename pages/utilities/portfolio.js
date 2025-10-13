/**
 * Utilities Hub - Portfolio Analytics Page
 * Portfolio optimization, backtesting, and risk metrics
 */

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import KpiCard from '../../components/KpiCard';
import { formatNumber, formatPercent } from '../../lib/helpers/format';
import { fetchMarketChart } from '../../lib/data/coingecko';
import { toPctReturns } from '../../lib/metrics/returns';
import { calculateMetrics } from '../../lib/metrics/performance';
import { equalWeight, riskParity, maxSharpe, calculateCovarianceMatrix } from '../../lib/portfolio/weights';
import { walkForward, pricesToReturnsMatrix } from '../../lib/portfolio/backtest';

// Popular crypto assets for selection
const AVAILABLE_ASSETS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
];

export default function PortfolioUtilities() {
  const [selectedAssets, setSelectedAssets] = useState(['bitcoin', 'ethereum', 'binancecoin']);
  const [horizon, setHorizon] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolios, setPortfolios] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleAsset = (assetId) => {
    if (selectedAssets.includes(assetId)) {
      if (selectedAssets.length > 2) {
        setSelectedAssets(selectedAssets.filter(id => id !== assetId));
      }
    } else {
      if (selectedAssets.length < 10) {
        setSelectedAssets([...selectedAssets, assetId]);
      }
    }
  };

  const calculatePortfolios = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch price data for selected assets
      const priceData = {};
      const promises = selectedAssets.map(async (assetId) => {
        const data = await fetchMarketChart(assetId, 'usd', horizon);
        if (data && data.prices) {
          priceData[assetId] = data.prices.map(p => p[1]);
        }
      });

      await Promise.all(promises);

      // Validate data
      const assetNames = Object.keys(priceData);
      if (assetNames.length < 2) {
        throw new Error('Need at least 2 assets with valid data');
      }

      // Calculate returns
      const returnsMatrix = pricesToReturnsMatrix(priceData);
      
      // Calculate covariance matrix
      const covMatrix = calculateCovarianceMatrix(returnsMatrix);

      // Calculate expected returns (simple historical mean, annualized)
      const expReturns = returnsMatrix.map(rets => {
        const mean = rets.reduce((sum, r) => sum + r, 0) / rets.length;
        return Math.pow(1 + mean, 252) - 1; // Annualize
      });

      // Calculate three portfolio strategies
      const equalWeights = equalWeight(assetNames.length);
      const riskParityWeights = riskParity(covMatrix);
      const maxSharpeWeights = maxSharpe(expReturns, covMatrix, 0, [0, 1], 2000);

      // Backtest each portfolio
      const strategyEqual = () => equalWeights;
      const strategyRP = () => riskParityWeights;
      const strategyMS = () => maxSharpeWeights;

      const btEqual = walkForward(priceData, 'monthly', strategyEqual);
      const btRP = walkForward(priceData, 'monthly', strategyRP);
      const btMS = walkForward(priceData, 'monthly', strategyMS);

      // Calculate metrics
      const metricsEqual = calculateMetrics(btEqual.returns, 0, 252);
      const metricsRP = calculateMetrics(btRP.returns, 0, 252);
      const metricsMS = calculateMetrics(btMS.returns, 0, 252);

      setPortfolios({
        assets: assetNames.map((name, i) => ({
          name,
          expReturn: expReturns[i],
          weights: {
            equal: equalWeights[i],
            riskParity: riskParityWeights[i],
            maxSharpe: maxSharpeWeights[i],
          },
        })),
        equal: { ...metricsEqual, backtest: btEqual },
        riskParity: { ...metricsRP, backtest: btRP },
        maxSharpe: { ...metricsMS, backtest: btMS },
      });

    } catch (err) {
      console.error('Portfolio calculation error:', err);
      setError(err.message || 'Failed to calculate portfolios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAssets.length >= 2) {
      calculatePortfolios();
    }
  }, [selectedAssets, horizon]);

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.2rem', 
            fontSize: '0.75rem', 
            color: '#7fffd4',
            marginBottom: '0.5rem' 
          }}>
            Utilities Hub
          </p>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#00ffcc' }}>
            Portfolio Analytics
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c0c0c0', maxWidth: '800px' }}>
            Analizza portafogli crypto con metriche risk-adjusted, ottimizzatori e backtesting.
            Solo a scopo educativo - nessuna raccomandazione finanziaria.
          </p>
        </header>

        {/* Asset Selection */}
        <section style={{ 
          background: '#11161d', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: '1px solid #1f2d36' 
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#00ffcc' }}>
            Seleziona Asset (min 2, max 10)
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {AVAILABLE_ASSETS.map(asset => (
              <button
                key={asset.id}
                onClick={() => toggleAsset(asset.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: selectedAssets.includes(asset.id) 
                    ? '2px solid #00ffcc' 
                    : '1px solid #1f2d36',
                  background: selectedAssets.includes(asset.id) ? '#00ffcc20' : '#0d1117',
                  color: selectedAssets.includes(asset.id) ? '#00ffcc' : '#c0c0c0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: selectedAssets.includes(asset.id) ? 'bold' : 'normal',
                }}
              >
                {asset.symbol}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c0c0c0' }}>
              Orizzonte temporale (giorni): <strong>{horizon}</strong>
            </label>
            <input
              type="range"
              min="30"
              max="365"
              step="30"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div style={{ 
            background: '#4a1a1a', 
            border: '1px solid #ff4444', 
            borderRadius: '8px', 
            padding: '1rem', 
            marginBottom: '2rem',
            color: '#ff8888' 
          }}>
            <strong>Errore:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7fffd4' }}>
            <p>Caricamento dati e calcolo portafogli...</p>
          </div>
        )}

        {/* Results */}
        {!loading && portfolios && (
          <>
            {/* Tabs */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #1f2d36' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['overview', 'weights', 'backtest'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid #00ffcc' : '2px solid transparent',
                      color: activeTab === tab ? '#00ffcc' : '#c0c0c0',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#00ffcc' }}>
                  Confronto Strategie
                </h2>

                {['equal', 'riskParity', 'maxSharpe'].map((strategy, idx) => (
                  <div key={strategy} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      marginBottom: '1rem', 
                      color: '#7fffd4',
                      textTransform: 'capitalize' 
                    }}>
                      {strategy === 'equal' ? 'Equal Weight' : 
                       strategy === 'riskParity' ? 'Risk Parity' : 
                       'Max Sharpe'}
                    </h3>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '1rem' 
                    }}>
                      <KpiCard
                        title="Sharpe Ratio"
                        value={formatNumber(portfolios[strategy].sharpe, 2)}
                      />
                      <KpiCard
                        title="Sortino Ratio"
                        value={formatNumber(portfolios[strategy].sortino, 2)}
                      />
                      <KpiCard
                        title="Volatilità Ann."
                        value={formatPercent(portfolios[strategy].volatility, 2, true)}
                      />
                      <KpiCard
                        title="Max Drawdown"
                        value={formatPercent(portfolios[strategy].maxDrawdown, 2, true)}
                      />
                      <KpiCard
                        title="Rendimento Totale"
                        value={formatPercent(portfolios[strategy].backtest.totalReturn, 2, true)}
                      />
                      <KpiCard
                        title="Turnover Medio"
                        value={formatPercent(portfolios[strategy].backtest.turnover, 2, true)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Weights Tab */}
            {activeTab === 'weights' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#00ffcc' }}>
                  Allocazione Pesi
                </h2>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    background: '#11161d',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <thead>
                      <tr style={{ background: '#1f2d36' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#00ffcc' }}>Asset</th>
                        <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Equal Weight</th>
                        <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Risk Parity</th>
                        <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Max Sharpe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolios.assets.map((asset, idx) => (
                        <tr key={asset.name} style={{ borderTop: '1px solid #1f2d36' }}>
                          <td style={{ padding: '1rem', color: '#f5f5f5' }}>
                            {AVAILABLE_ASSETS.find(a => a.id === asset.name)?.symbol || asset.name}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', color: '#c0c0c0' }}>
                            {formatPercent(asset.weights.equal * 100, 1)}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', color: '#c0c0c0' }}>
                            {formatPercent(asset.weights.riskParity * 100, 1)}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', color: '#c0c0c0' }}>
                            {formatPercent(asset.weights.maxSharpe * 100, 1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Backtest Tab */}
            {activeTab === 'backtest' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#00ffcc' }}>
                  Risultati Backtest
                </h2>
                <p style={{ color: '#c0c0c0', marginBottom: '2rem' }}>
                  Walk-forward backtest con ribilanciamento mensile su {horizon} giorni.
                </p>

                <div style={{ 
                  background: '#11161d', 
                  borderRadius: '8px', 
                  padding: '1.5rem',
                  border: '1px solid #1f2d36'
                }}>
                  <h3 style={{ color: '#7fffd4', marginBottom: '1rem' }}>Statistiche Backtest</h3>
                  
                  {['equal', 'riskParity', 'maxSharpe'].map(strategy => (
                    <div key={strategy} style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ color: '#00ffcc', marginBottom: '0.5rem' }}>
                        {strategy === 'equal' ? 'Equal Weight' : 
                         strategy === 'riskParity' ? 'Risk Parity' : 
                         'Max Sharpe'}
                      </h4>
                      <div style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
                        <p>Valore Finale: ${portfolios[strategy].backtest.finalValue.toFixed(2)}</p>
                        <p>Numero Ribilanciamenti: {portfolios[strategy].backtest.rebalanceCount}</p>
                        <p>Turnover Totale: {formatPercent(portfolios[strategy].backtest.totalTurnover * 100, 2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          background: '#1a1a2e', 
          borderRadius: '8px',
          border: '2px solid #ffa500'
        }}>
          <h3 style={{ color: '#ffa500', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
            ⚠️ Disclaimer Importante
          </h3>
          <p style={{ color: '#c0c0c0', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Questo strumento è fornito esclusivamente a <strong>scopo educativo</strong>. 
            I risultati sono basati su dati storici e non garantiscono performance future. 
            Non costituisce consulenza finanziaria. Consulta sempre un professionista qualificato prima di prendere decisioni di investimento.
          </p>
        </div>
      </div>

      <style jsx>{`
        .kpi-card {
          background: #11161d;
          border: 1px solid #1f2d36;
          border-radius: 8px;
          padding: 1rem;
        }
        .kpi-card__title {
          font-size: 0.85rem;
          color: #7fffd4;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
        }
        .kpi-card__value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #f5f5f5;
        }
        .kpi-card__unit {
          font-size: 1rem;
          color: #c0c0c0;
          margin-left: 0.25rem;
        }
        .kpi-card__delta {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .delta-positive {
          color: #00ff88;
        }
        .delta-negative {
          color: #ff4444;
        }
        .delta-neutral {
          color: #c0c0c0;
        }
      `}</style>
    </Layout>
  );
}
