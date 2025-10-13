/**
 * Utilities Hub - Yield Screener
 * Shows DeFi yield opportunities from DeFiLlama
 */

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { fetchYields } from '../../lib/data/defillama';
import { formatNumber, formatPercent } from '../../lib/helpers/format';

export default function YieldScreener() {
  const [pools, setPools] = useState([]);
  const [filteredPools, setFilteredPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    chain: '',
    minTvl: 1000000, // 1M USD
    minAge: 30, // 30 days
  });

  useEffect(() => {
    loadYields();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pools, filters]);

  const loadYields = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchYields();
      
      // Filter out invalid/incomplete entries
      const validPools = data.filter(pool => 
        pool && 
        pool.symbol && 
        pool.chain && 
        pool.tvlUsd > 0 &&
        (pool.apy || pool.apyBase || pool.apyReward)
      );

      setPools(validPools);
    } catch (err) {
      setError(err.message || 'Failed to load yield data');
      console.error('Yield fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pools];

    // Filter by chain
    if (filters.chain) {
      filtered = filtered.filter(p => 
        p.chain && p.chain.toLowerCase() === filters.chain.toLowerCase()
      );
    }

    // Filter by TVL
    if (filters.minTvl > 0) {
      filtered = filtered.filter(p => p.tvlUsd >= filters.minTvl);
    }

    // Sort by APY descending
    filtered.sort((a, b) => {
      const apyA = a.apy || a.apyBase || 0;
      const apyB = b.apy || b.apyBase || 0;
      return apyB - apyA;
    });

    // Limit to top 100 for performance
    setFilteredPools(filtered.slice(0, 100));
  };

  const getUniqueChains = () => {
    const chains = new Set(pools.map(p => p.chain).filter(Boolean));
    return Array.from(chains).sort();
  };

  const getPoolAge = (pool) => {
    if (!pool.poolMeta || !pool.poolMeta.ilRisk) return 'N/A';
    // Rough age estimation from inception if available
    return 'N/A';
  };

  const getApy = (pool) => {
    return pool.apy || pool.apyBase || pool.apyReward || 0;
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
            Yield Screener
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c0c0c0', maxWidth: '800px' }}>
            Explore DeFi yield opportunities across chains. Data from DeFiLlama.
          </p>
        </header>

        {/* Disclaimer */}
        <div style={{ 
          padding: '1rem', 
          background: '#1a1a2e', 
          borderRadius: '8px', 
          border: '1px solid #ff6b6b',
          marginBottom: '2rem',
          color: '#ffcccb'
        }}>
          <strong>⚠️ Disclaimer:</strong> APY values are indicative and subject to high volatility. 
          DeFi protocols carry smart contract risk, impermanent loss, and other risks. 
          This is educational information only - not financial advice. Always DYOR.
        </div>

        {/* Filters */}
        <div style={{ 
          background: '#11161d', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', color: '#00ffcc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Chain
            </label>
            <select
              value={filters.chain}
              onChange={(e) => setFilters({ ...filters, chain: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c0c0c0',
              }}
            >
              <option value="">All Chains</option>
              {getUniqueChains().map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#00ffcc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Min TVL (USD)
            </label>
            <select
              value={filters.minTvl}
              onChange={(e) => setFilters({ ...filters, minTvl: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c0c0c0',
              }}
            >
              <option value={0}>No minimum</option>
              <option value={100000}>$100K+</option>
              <option value={1000000}>$1M+</option>
              <option value={10000000}>$10M+</option>
              <option value={100000000}>$100M+</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={loadYields}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                background: loading ? '#555' : '#00ffcc',
                color: loading ? '#999' : '#0d1117',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div style={{ padding: '1rem', background: '#1a1a2e', border: '1px solid #ff6b6b', borderRadius: '8px', color: '#ff6b6b', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && filteredPools.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#c0c0c0' }}>
            No pools found matching the criteria.
          </div>
        )}

        {!loading && !error && filteredPools.length > 0 && (
          <div style={{ background: '#11161d', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1f2d36', borderBottom: '2px solid #30363d' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#00ffcc' }}>Pool</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#00ffcc' }}>Chain</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>APY</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>TVL</th>
                    <th style={{ padding: '1rem', textAlign: 'center', color: '#00ffcc' }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPools.map((pool, idx) => (
                    <tr 
                      key={`${pool.pool || idx}`}
                      style={{ 
                        borderBottom: '1px solid #30363d',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1a1f2e'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: '#fff', fontWeight: '500' }}>
                          {pool.symbol || pool.pool || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                          {pool.project || 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#c0c0c0' }}>
                        {pool.chain || 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc', fontWeight: 'bold' }}>
                        {formatPercent(getApy(pool), 2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#c0c0c0' }}>
                        ${formatNumber(pool.tvlUsd || 0, 0)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span 
                          style={{ 
                            padding: '0.25rem 0.5rem', 
                            background: pool.ilRisk === 'no' ? '#2d5f2e' : '#5f4d2d',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}
                          title={pool.ilRisk === 'no' ? 'No impermanent loss risk' : 'May have IL risk'}
                        >
                          {pool.ilRisk === 'no' ? '✓ Low IL' : '⚠ Check IL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '1rem', textAlign: 'center', color: '#888', fontSize: '0.9rem', borderTop: '1px solid #30363d' }}>
              Showing {filteredPools.length} of {pools.length} pools • Data cached for 60 seconds
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
