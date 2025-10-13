/**
 * Utilities Hub - Pagina indice principale
 * Punto di accesso ad analytics di portafoglio e scanner di arbitraggio
 */

import Layout from '../../components/Layout';
import Link from 'next/link';

export default function UtilitiesHub() {
  const tools = [
    {
      title: 'Portfolio Analytics',
      description: 'Analizza portafogli crypto con ottimizzatori (Equal Weight, Risk Parity, Max Sharpe), backtesting walk-forward e metriche risk-adjusted complete.',
      link: '/utilities/portfolio',
      icon: '📊',
      features: ['Rapporto di Sharpe', 'Rapporto di Sortino', 'Max Drawdown', 'Backtest 3+ anni'],
    },
    {
      title: 'Efficient Frontier',
      description: 'Visualizza la frontiera efficiente e confronta strategie di portfolio con scatter chart interattivo. Export CSV disponibile.',
      link: '/utilities/frontier',
      icon: '📈',
      features: ['1k-2k portafogli campionati', 'Highlight EW/RP/MaxSharpe', 'Export CSV', 'Regolazione shrinkage'],
    },
    {
      title: 'Yield Screener',
      description: 'Esplora opportunità di yield DeFi da DeFiLlama. Filtra per chain, TVL e age. Solo informativo - DYOR sempre.',
      link: '/utilities/yields',
      icon: '💰',
      features: ['Yields multi-chain', 'Filtri TVL & APY', 'Alert impermanent loss', 'Solo educativo'],
    },
    {
      title: 'Arbitrage Scanner',
      description: 'Scanner simulato di opportunità di arbitraggio tra exchange. Considera fee, slippage e calcola spread netti. Solo a scopo educativo.',
      link: '/utilities/arbitrage',
      icon: '🔄',
      features: ['Scan multi-venue', 'Modellazione fee', 'Simulazione P&L', 'Solo educativo'],
    },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.2rem', 
            fontSize: '0.75rem', 
            color: '#7fffd4',
            marginBottom: '0.5rem' 
          }}>
            Strumenti Avanzati
          </p>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#00ffcc' }}>
            Hub Utility
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#c0c0c0', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Suite di strumenti quantitativi per l'analisi di portafogli crypto, 
            ottimizzazione risk-adjusted, backtesting e scanning di opportunità.
          </p>
        </header>

        {/* Griglia strumenti */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {tools.map((tool, idx) => (
            <Link key={idx} href={tool.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#11161d',
                border: '1px solid #1f2d36',
                borderRadius: '12px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ffcc';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1f2d36';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tool.icon}</div>
                <h2 style={{ fontSize: '1.5rem', color: '#00ffcc', marginBottom: '1rem' }}>
                  {tool.title}
                </h2>
                <p style={{ color: '#c0c0c0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {tool.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {tool.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '12px',
                        background: '#1f2d36',
                        color: '#7fffd4',
                        fontSize: '0.85rem',
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Caratteristiche principali */}
        <section style={{ 
          background: '#11161d', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          border: '1px solid #1f2d36'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#00ffcc', marginBottom: '1.5rem', textAlign: 'center' }}>
            Caratteristiche Principali
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                📈 Metriche Risk-Adjusted
              </h3>
              <p style={{ color: '#c0c0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Sharpe, Sortino, Calmar, Information Ratio, VaR, Expected Shortfall
              </p>
            </div>

            <div>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🎯 Ottimizzatori Portafoglio
              </h3>
              <p style={{ color: '#c0c0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Equal Weight, Risk Parity, Min Variance, Max Sharpe con grid search
              </p>
            </div>

            <div>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🔄 Backtesting Avanzato
              </h3>
              <p style={{ color: '#c0c0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Walk-forward con ribilanciamento periodico e calcolo turnover
              </p>
            </div>

            <div>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🔍 Data Connectors
              </h3>
              <p style={{ color: '#c0c0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Integrazione CoinGecko e DefiLlama con caching e retry logic
              </p>
            </div>

            <div>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                ⚡ Performance
              </h3>
              <p style={{ color: '#c0c0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Caching in-memory con TTL, rate limiting, request retry esponenziale
              </p>
            </div>

            <div>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🛡️ Sicurezza
              </h3>
              <p style={{ color: '#c0c0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Solo endpoint pubblici, no API keys, no esecuzione ordini reali
              </p>
            </div>
          </div>
        </section>

        {/* Dettagli tecnici */}
        <section style={{ 
          background: '#11161d', 
          borderRadius: '12px', 
          padding: '2rem', 
          marginBottom: '3rem',
          border: '1px solid #1f2d36'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#00ffcc', marginBottom: '1rem' }}>
            Dettagli Tecnici
          </h2>
          <div style={{ color: '#c0c0c0', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#7fffd4' }}>Architettura:</strong> Moduli JavaScript puri senza dipendenze pesanti, 
              ottimizzatori con grid/random search su simplex, metriche calcolate client-side.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#7fffd4' }}>Dati:</strong> CoinGecko API pubblica per prezzi storici, 
              DefiLlama per TVL e yields, caching 60-120s TTL, localStorage persistence opzionale.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: '#7fffd4' }}>Calcoli:</strong> Returns aritmetici/log, covariance matrix, 
              annualizzazione 252 periodi, volatility proxy |APY-APY7d|, numerical stability checks.
            </p>
            <p>
              <strong style={{ color: '#7fffd4' }}>Testing:</strong> Suite di test con Vitest, coverage metriche e portfolio logic, 
              CI/CD con GitHub Actions.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div style={{ 
          padding: '1.5rem', 
          background: '#1a1a2e', 
          borderRadius: '8px',
          border: '2px solid #ffa500',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ffa500', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
            ⚠️ Disclaimer Importante
          </h3>
          <p style={{ color: '#c0c0c0', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
            Tutti gli strumenti sono forniti <strong>esclusivamente a scopo educativo</strong>. 
            Non costituiscono consulenza finanziaria. I risultati passati non garantiscono performance future. 
            Le simulazioni di arbitraggio non eseguono operazioni reali. 
            Consulta sempre professionisti qualificati prima di prendere decisioni di investimento.
          </p>
        </div>
      </div>
    </Layout>
  );
}
