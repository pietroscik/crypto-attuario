import { useState } from 'react';
import Layout from '../components/Layout';
import useSWR from 'swr';

interface RankedPool {
  chain: string;
  project: string;
  symbol: string;
  apy: number;
  apyBase: number | null;
  apy7d: number | null;
  tvlUsd: number;
  url: string;
  volProxy: number;
  riskAdjustedMetric: number;
}

interface ApiResponse {
  success: boolean;
  data: RankedPool[];
  meta: {
    total: number;
    returned: number;
    params: {
      rf: number;
      minTVL: number;
      limit: number;
    };
  };
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AttuarioRanking() {
  const [rf, setRf] = useState(4.5);
  const [minTVL, setMinTVL] = useState(1000000);
  const [limit, setLimit] = useState(50);
  const [sortField, setSortField] = useState<keyof RankedPool>('riskAdjustedMetric');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/attuario?rf=${rf}&minTVL=${minTVL}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: false,
    }
  );

  const handleSort = (field: keyof RankedPool) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedData = () => {
    if (!data?.data) return [];
    
    const sorted = [...data.data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
    
    return sorted;
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  const formatCurrency = (num: number) => {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <Layout>
      <section aria-labelledby="ranking-title">
        <h2 id="ranking-title" style={{ color: '#00ffcc', marginBottom: '1rem' }}>
          Ranking Attuariale DeFi
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          Classifica risk-adjusted dei pool DeFi più performanti, 
          basata su dati in tempo reale da DefiLlama. 
          Il Risk-Adjusted Index è calcolato come (APY - rf) / Volatilità Proxy.
        </p>

        {/* Controls */}
        <form
          aria-label="Filtri di ranking"
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#11161d',
            borderRadius: '8px',
            border: '1px solid #1f2d36',
          }}
        >
          <div>
            <label 
              htmlFor="risk-free-rate"
              style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}
            >
              Risk-free rate (%)
            </label>
            <input
              id="risk-free-rate"
              type="number"
              value={rf}
              onChange={(e) => setRf(parseFloat(e.target.value) || 0)}
              step="0.1"
              aria-describedby="rf-description"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#0a0f14',
                border: '1px solid #1f2d36',
                borderRadius: '4px',
                color: '#fff',
              }}
            />
            <span id="rf-description" style={{ display: 'none' }}>
              Tasso risk-free per il calcolo del rendimento excess
            </span>
          </div>
          <div>
            <label 
              htmlFor="min-tvl"
              style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}
            >
              Min TVL (USD)
            </label>
            <input
              id="min-tvl"
              type="number"
              value={minTVL}
              onChange={(e) => setMinTVL(parseFloat(e.target.value) || 0)}
              step="100000"
              aria-describedby="tvl-description"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#0a0f14',
                border: '1px solid #1f2d36',
                borderRadius: '4px',
                color: '#fff',
              }}
            />
            <span id="tvl-description" style={{ display: 'none' }}>
              Valore minimo di Total Value Locked per filtrare i pool
            </span>
          </div>
          <div>
            <label 
              htmlFor="result-limit"
              style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}
            >
              Limite risultati
            </label>
            <input
              id="result-limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 50)}
              min="1"
              max="500"
              aria-describedby="limit-description"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#0a0f14',
                border: '1px solid #1f2d36',
                borderRadius: '4px',
                color: '#fff',
              }}
            />
            <span id="limit-description" style={{ display: 'none' }}>
              Numero massimo di pool da visualizzare (massimo 500)
            </span>
          </div>
        </form>

        {/* Loading/Error states */}
        {isLoading && (
          <div 
            role="status" 
            aria-live="polite"
            style={{ textAlign: 'center', padding: '2rem', color: '#7fffd4' }}
          >
            <span>Caricamento dati in corso...</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              padding: '1rem',
              background: '#2d1515',
              border: '1px solid #ff4444',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <strong style={{ color: '#ff6666' }}>Errore:</strong> Impossibile caricare i dati.
            {error.message && <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.message}</div>}
          </div>
        )}

        {/* Data table */}
        {data?.data && (
          <>
            <div 
              style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#a0f0e0' }}
              role="status"
              aria-live="polite"
            >
              Mostrando {data.meta.returned} di {data.meta.total} pool | 
              Ultimo aggiornamento: {new Date(data.timestamp).toLocaleString('it-IT')}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table
                role="table"
                aria-label="Ranking pool DeFi"
                aria-describedby="ranking-title"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: '#11161d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <thead style={{ background: '#0a0f14', color: '#00ffcc' }}>
                  <tr role="row">
                    <th
                      onClick={() => handleSort('project')}
                      role="columnheader"
                      aria-sort={sortField === 'project' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'inherit',
                          font: 'inherit',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        aria-label="Ordina per protocollo"
                      >
                        Protocol {sortField === 'project' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th
                      onClick={() => handleSort('chain')}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      Chain {sortField === 'chain' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('symbol')}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      Symbol {sortField === 'symbol' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('apy')}
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      APY (%) {sortField === 'apy' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('tvlUsd')}
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      TVL {sortField === 'tvlUsd' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('volProxy')}
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      Vol. Proxy {sortField === 'volProxy' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('riskAdjustedMetric')}
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '2px solid #1f2d36',
                      }}
                    >
                      Risk-Adj Index {sortField === 'riskAdjustedMetric' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedData().map((pool, idx) => (
                    <tr
                      key={`${pool.project}-${pool.chain}-${pool.symbol}-${idx}`}
                      style={{
                        borderBottom: '1px solid #1f2d36',
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        {pool.url ? (
                          <a
                            href={pool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#7fffd4', textDecoration: 'none' }}
                          >
                            {pool.project}
                          </a>
                        ) : (
                          pool.project
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>{pool.chain}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#a0f0e0' }}>
                        {pool.symbol}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'right',
                          color: pool.apy > 10 ? '#7fffd4' : '#cbd5f5',
                        }}
                      >
                        {formatNumber(pool.apy)}%
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {formatCurrency(pool.tvlUsd)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem' }}>
                        {formatNumber(pool.volProxy, 3)}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'right',
                          fontWeight: 'bold',
                          color: pool.riskAdjustedMetric > 100 ? '#00ffcc' : '#7fffd4',
                        }}
                      >
                        {formatNumber(pool.riskAdjustedMetric, 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Info box */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#11161d',
            borderRadius: '8px',
            border: '1px solid #1f2d36',
          }}
        >
          <h3 style={{ color: '#7fffd4', marginBottom: '1rem' }}>
            📊 Metodologia
          </h3>
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>
            <strong>Risk-Adjusted Index:</strong> Metrica tipo Sharpe ratio che misura il rendimento
            excess (APY - risk-free rate) normalizzato per la volatilità proxy.
          </p>
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>
            <strong>Volatilità Proxy:</strong> Calcolata come |APY - APY_7d|. 
            Se non disponibile, viene usato un valore di default (0.05). 
            Un minimo di 0.001 è applicato per evitare divisioni per valori prossimi allo zero.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            <strong>Fonte dati:</strong> <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00ffcc' }}
            >
              DefiLlama
            </a> - Aggiornamento automatico ogni 60 secondi.
          </p>
        </div>
      </section>
    </Layout>
  );
}
