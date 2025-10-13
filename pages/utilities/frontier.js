/**
 * Utilities Hub - Efficient Frontier
 * Visualizes the efficient frontier for selected portfolios
 */

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { formatPercent, formatNumber } from '../../lib/helpers/format';
import { fetchMarketChart } from '../../lib/data/coingecko';
import { pricesToReturnsMatrix } from '../../lib/portfolio/backtest';
import { calculateCovarianceMatrix, shrinkCov } from '../../lib/portfolio/weights';
import { generateFrontier, exportFrontierCSV } from '../../lib/portfolio/frontier';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const AVAILABLE_ASSETS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
];

export default function EfficientFrontier() {
  const [selectedAssets, setSelectedAssets] = useState(['bitcoin', 'ethereum', 'binancecoin']);
  const [horizon, setHorizon] = useState(180);
  const [shrinkage, setShrinkage] = useState(0.10);
  const [tradingDays, setTradingDays] = useState(365);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [frontierData, setFrontierData] = useState(null);

  const toggleAsset = (assetId) => {
    if (selectedAssets.includes(assetId)) {
      if (selectedAssets.length > 2) {
        setSelectedAssets(selectedAssets.filter(id => id !== assetId));
      }
    } else {
      if (selectedAssets.length < 5) {
        setSelectedAssets([...selectedAssets, assetId]);
      }
    }
  };

  const calculateFrontier = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch price data
      const priceData = {};
      const promises = selectedAssets.map(async (assetId) => {
        const data = await fetchMarketChart(assetId, 'usd', horizon);
        if (data && data.prices) {
          priceData[assetId] = data.prices.map(p => p[1]);
        }
      });

      await Promise.all(promises);

      const assetNames = Object.keys(priceData);
      if (assetNames.length < 2) {
        throw new Error('Need at least 2 assets with valid data');
      }

      // Calculate returns
      const returnsMatrix = pricesToReturnsMatrix(priceData);
      
      // Calculate and shrink covariance matrix
      let covMatrix = calculateCovarianceMatrix(returnsMatrix);
      covMatrix = shrinkCov(covMatrix, shrinkage);

      // Calculate expected returns (annualized)
      const expReturns = returnsMatrix.map(rets => {
        const mean = rets.reduce((sum, r) => sum + r, 0) / rets.length;
        return Math.pow(1 + mean, tradingDays) - 1;
      });

      // Generate frontier
      const frontier = generateFrontier(expReturns, covMatrix, 1500, [0, 1]);

      setFrontierData({
        ...frontier,
        assetNames,
      });

    } catch (err) {
      setError(err.message || 'Failed to calculate frontier');
      console.error('Frontier calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!frontierData) return;

    const csv = exportFrontierCSV(frontierData, frontierData.assetNames);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efficient-frontier-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const getChartData = () => {
    if (!frontierData) return [];

    const data = frontierData.points.map((p, i) => ({
      x: p.risk * 100, // Convert to percentage
      y: p.return * 100,
      type: 'sample',
      name: `Portfolio ${i + 1}`,
    }));

    // Add notable portfolios
    if (frontierData.equalWeight) {
      data.push({
        x: frontierData.equalWeight.risk * 100,
        y: frontierData.equalWeight.return * 100,
        type: 'equalWeight',
        name: 'Equal Weight',
      });
    }
    if (frontierData.riskParity) {
      data.push({
        x: frontierData.riskParity.risk * 100,
        y: frontierData.riskParity.return * 100,
        type: 'riskParity',
        name: 'Risk Parity',
      });
    }
    if (frontierData.maxSharpe) {
      data.push({
        x: frontierData.maxSharpe.risk * 100,
        y: frontierData.maxSharpe.return * 100,
        type: 'maxSharpe',
        name: 'Max Sharpe',
      });
    }

    return data;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          background: '#11161d', 
          padding: '0.75rem', 
          border: '1px solid #30363d',
          borderRadius: '4px'
        }}>
          <div style={{ color: '#00ffcc', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {data.name}
          </div>
          <div style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
            Risk: {data.x.toFixed(2)}%
          </div>
          <div style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
            Return: {data.y.toFixed(2)}%
          </div>
        </div>
      );
    }
    return null;
  };

  const getColor = (type) => {
    switch (type) {
      case 'equalWeight': return '#ffcc00';
      case 'riskParity': return '#ff6b6b';
      case 'maxSharpe': return '#00ff00';
      default: return '#4dabf7';
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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
            Efficient Frontier
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c0c0c0', maxWidth: '800px' }}>
            Visualize risk-return tradeoffs across portfolio combinations.
          </p>
        </header>

        {/* Controls */}
        <div style={{ background: '#11161d', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          {/* Asset Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#00ffcc', marginBottom: '0.75rem', fontWeight: 'bold' }}>
              Select Assets (2-5):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {AVAILABLE_ASSETS.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => toggleAsset(asset.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedAssets.includes(asset.id) ? '#00ffcc' : '#1f2d36',
                    color: selectedAssets.includes(asset.id) ? '#0d1117' : '#c0c0c0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: selectedAssets.includes(asset.id) ? 'bold' : 'normal',
                  }}
                >
                  {asset.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#00ffcc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Horizon: {horizon} days
              </label>
              <input
                type="range"
                min="90"
                max="730"
                step="30"
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#00ffcc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Shrinkage α: {shrinkage.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="0.30"
                step="0.01"
                value={shrinkage}
                onChange={(e) => setShrinkage(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#00ffcc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Trading Days
              </label>
              <select
                value={tradingDays}
                onChange={(e) => setTradingDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: '#c0c0c0',
                }}
              >
                <option value={252}>252 (Traditional)</option>
                <option value={365}>365 (Crypto)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={calculateFrontier}
              disabled={loading || selectedAssets.length < 2}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? '#555' : '#00ffcc',
                color: loading ? '#999' : '#0d1117',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: loading || selectedAssets.length < 2 ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Computing...' : 'Calculate Frontier'}
            </button>

            {frontierData && (
              <button
                onClick={downloadCSV}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#1f2d36',
                  color: '#00ffcc',
                  border: '1px solid #00ffcc',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '1rem', background: '#1a1a2e', border: '1px solid #ff6b6b', borderRadius: '8px', color: '#ff6b6b', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Chart */}
        {frontierData && (
          <div style={{ background: '#11161d', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#00ffcc', marginBottom: '1rem' }}>Risk-Return Space</h3>
            
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Risk" 
                  unit="%" 
                  stroke="#c0c0c0"
                  label={{ value: 'Risk (Volatility %)', position: 'insideBottom', offset: -10, fill: '#c0c0c0' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Return" 
                  unit="%" 
                  stroke="#c0c0c0"
                  label={{ value: 'Return %', angle: -90, position: 'insideLeft', fill: '#c0c0c0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Sample points */}
                <Scatter 
                  name="Portfolios" 
                  data={getChartData().filter(d => d.type === 'sample')} 
                  fill="#4dabf7"
                  fillOpacity={0.4}
                />
                
                {/* Notable portfolios */}
                <Scatter 
                  name="Equal Weight" 
                  data={getChartData().filter(d => d.type === 'equalWeight')}
                  fill="#ffcc00"
                  shape="star"
                />
                <Scatter 
                  name="Risk Parity" 
                  data={getChartData().filter(d => d.type === 'riskParity')}
                  fill="#ff6b6b"
                  shape="diamond"
                />
                <Scatter 
                  name="Max Sharpe" 
                  data={getChartData().filter(d => d.type === 'maxSharpe')}
                  fill="#00ff00"
                  shape="triangle"
                />
              </ScatterChart>
            </ResponsiveContainer>

            {/* Portfolio Details */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {frontierData.equalWeight && (
                <div style={{ padding: '1rem', background: '#1a1f2e', borderRadius: '8px', border: '1px solid #ffcc00' }}>
                  <div style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '0.5rem' }}>⭐ Equal Weight</div>
                  <div style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
                    Risk: {formatPercent(frontierData.equalWeight.risk * 100, 2)}<br />
                    Return: {formatPercent(frontierData.equalWeight.return * 100, 2)}<br />
                    Sharpe: {frontierData.equalWeight.sharpe.toFixed(3)}
                  </div>
                </div>
              )}

              {frontierData.riskParity && (
                <div style={{ padding: '1rem', background: '#1a1f2e', borderRadius: '8px', border: '1px solid #ff6b6b' }}>
                  <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '0.5rem' }}>◆ Risk Parity</div>
                  <div style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
                    Risk: {formatPercent(frontierData.riskParity.risk * 100, 2)}<br />
                    Return: {formatPercent(frontierData.riskParity.return * 100, 2)}<br />
                    Sharpe: {frontierData.riskParity.sharpe.toFixed(3)}
                  </div>
                </div>
              )}

              {frontierData.maxSharpe && (
                <div style={{ padding: '1rem', background: '#1a1f2e', borderRadius: '8px', border: '1px solid #00ff00' }}>
                  <div style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '0.5rem' }}>▲ Max Sharpe</div>
                  <div style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>
                    Risk: {formatPercent(frontierData.maxSharpe.risk * 100, 2)}<br />
                    Return: {formatPercent(frontierData.maxSharpe.return * 100, 2)}<br />
                    Sharpe: {frontierData.maxSharpe.sharpe.toFixed(3)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ 
          padding: '1rem', 
          background: '#1a1a2e', 
          borderRadius: '8px', 
          border: '1px solid #30363d',
          color: '#c0c0c0',
          fontSize: '0.9rem'
        }}>
          <strong style={{ color: '#00ffcc' }}>Note:</strong> The efficient frontier is synthetically generated 
          using historical data. Past performance does not guarantee future results. This is for educational purposes only.
        </div>
      </div>
    </Layout>
  );
}
