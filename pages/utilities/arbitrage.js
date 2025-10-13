/**
 * Utilities Hub - Paper Trading Arbitrage Scanner
 * Simulated arbitrage opportunities scanner (educational only)
 */

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { formatNumber, formatPercent, formatCurrency } from '../../lib/helpers/format';
import { scanPairs, formatOpportunity } from '../../lib/strategies/arbitrage';
import { fetchSimplePrice } from '../../lib/data/coingecko';

// Simulated venues for demonstration
const SIMULATED_VENUES = ['Binance', 'Coinbase', 'Kraken', 'Bybit'];

export default function ArbitrageScanner() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [feeModel, setFeeModel] = useState('conservative');
  const [minSpread, setMinSpread] = useState(0.004);
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  const scanOpportunities = async () => {
    setLoading(true);

    try {
      // Fetch current price from CoinGecko
      const priceData = await fetchSimplePrice([selectedCoin], ['usd'], true);
      const basePrice = priceData[selectedCoin]?.usd || 0;

      if (basePrice === 0) {
        throw new Error('Unable to fetch price data');
      }

      // Simulate venue quotes with random spreads (for demonstration)
      const quotesByVenue = {};
      
      SIMULATED_VENUES.forEach(venue => {
        // Simulate bid-ask spread and slight price variations
        const priceVariation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
        const midPrice = basePrice * (1 + priceVariation);
        const spread = 0.001 + Math.random() * 0.002; // 0.1-0.3% spread
        
        quotesByVenue[venue] = {
          bid: midPrice * (1 - spread / 2),
          ask: midPrice * (1 + spread / 2),
          volume: 1000 + Math.random() * 9000,
          timestamp: Date.now(),
        };
      });

      // Scan for arbitrage opportunities
      const opps = scanPairs(quotesByVenue, {
        minSpread,
        feeModel,
        maxSize: 1000,
      });

      setOpportunities(opps);
      setLastUpdate(new Date().toLocaleTimeString('it-IT'));

    } catch (err) {
      console.error('Arbitrage scan error:', err);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanOpportunities();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(scanOpportunities, 30000);
    return () => clearInterval(interval);
  }, [selectedCoin, feeModel, minSpread]);

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Compliance Banner */}
        <div style={{ 
          background: '#4a1a1a', 
          border: '3px solid #ff4444', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ff8888', marginBottom: '0.75rem', fontSize: '1.3rem' }}>
            ⚠️ EDUCATIONAL PURPOSES ONLY
          </h2>
          <p style={{ color: '#ffcccc', lineHeight: 1.6, fontSize: '1rem' }}>
            Questo scanner è completamente <strong>simulato</strong> e fornito solo per scopi educativi. 
            Non esegue operazioni reali. Non costituisce consulenza finanziaria o raccomandazioni di trading. 
            I dati visualizzati sono simulazioni basate su variazioni casuali dei prezzi di mercato.
          </p>
        </div>

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
            Paper Trading Arbitrage Scanner
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c0c0c0', maxWidth: '800px' }}>
            Scanner simulato di opportunità di arbitraggio tra exchange. 
            Utilizza dati pubblici e modelli di fee per identificare differenziali di prezzo teorici.
          </p>
        </header>

        {/* Controls */}
        <section style={{ 
          background: '#11161d', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: '1px solid #1f2d36' 
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#00ffcc' }}>
            Configurazione Scanner
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {/* Coin Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c0c0c0' }}>
                Criptovaluta
              </label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #1f2d36',
                  background: '#0d1117',
                  color: '#f5f5f5',
                  fontSize: '1rem',
                }}
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="binancecoin">BNB</option>
                <option value="solana">Solana (SOL)</option>
                <option value="cardano">Cardano (ADA)</option>
              </select>
            </div>

            {/* Fee Model */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c0c0c0' }}>
                Modello Fee
              </label>
              <select
                value={feeModel}
                onChange={(e) => setFeeModel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #1f2d36',
                  background: '#0d1117',
                  color: '#f5f5f5',
                  fontSize: '1rem',
                }}
              >
                <option value="conservative">Conservative (0.4% taker, 0.1% withdrawal)</option>
                <option value="optimistic">Optimistic (0.2% taker, 0.05% withdrawal)</option>
              </select>
            </div>

            {/* Min Spread */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c0c0c0' }}>
                Spread Minimo: {formatPercent(minSpread * 100, 2)}
              </label>
              <input
                type="range"
                min="0.001"
                max="0.02"
                step="0.001"
                value={minSpread}
                onChange={(e) => setMinSpread(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={scanOpportunities}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                background: loading ? '#555' : '#00ffcc',
                color: loading ? '#999' : '#000',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Scansione...' : 'Aggiorna Scanner'}
            </button>

            {lastUpdate && (
              <span style={{ color: '#7fffd4', fontSize: '0.9rem' }}>
                Ultimo aggiornamento: {lastUpdate}
              </span>
            )}
          </div>
        </section>

        {/* Results */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#00ffcc' }}>
            Opportunità Rilevate
          </h2>

          {opportunities.length === 0 && !loading && (
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center', 
              background: '#11161d', 
              borderRadius: '8px',
              border: '1px solid #1f2d36',
              color: '#c0c0c0' 
            }}>
              Nessuna opportunità trovata con i parametri attuali.
              Prova ad abbassare lo spread minimo o cambiare il modello di fee.
            </div>
          )}

          {opportunities.length > 0 && (
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
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#00ffcc' }}>Buy @ Venue</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#00ffcc' }}>Sell @ Venue</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Buy Price</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Sell Price</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Spread Netto</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: '#00ffcc' }}>Profitto Est.</th>
                    <th style={{ padding: '1rem', textAlign: 'center', color: '#00ffcc' }}>Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #1f2d36' }}>
                      <td style={{ padding: '1rem', color: '#f5f5f5' }}>{opp.buyVenue}</td>
                      <td style={{ padding: '1rem', color: '#f5f5f5' }}>{opp.sellVenue}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#c0c0c0' }}>
                        {formatCurrency(opp.buyPrice)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#c0c0c0' }}>
                        {formatCurrency(opp.sellPrice)}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        color: opp.netSpread > 0.01 ? '#00ff88' : '#7fffd4',
                        fontWeight: 'bold'
                      }}>
                        {formatPercent(opp.netSpread * 100, 2)}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        color: '#00ff88',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(opp.estimatedProfit)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          background: '#4a1a4a',
                          color: '#ff88ff',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                        }}>
                          SIMULATED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Info Section */}
        <section style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          background: '#11161d', 
          borderRadius: '8px',
          border: '1px solid #1f2d36'
        }}>
          <h3 style={{ color: '#7fffd4', marginBottom: '1rem', fontSize: '1.2rem' }}>
            Come Funziona
          </h3>
          <div style={{ color: '#c0c0c0', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>1. Raccolta Prezzi:</strong> Lo scanner simula i prezzi bid/ask da diversi exchange 
              basandosi su dati pubblici di mercato con variazioni casuali per dimostrare il concetto di arbitraggio.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>2. Calcolo Spread:</strong> Identifica differenziali di prezzo tra coppie di exchange, 
              sottraendo le fee di trading e withdrawal.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>3. Stima Profitto:</strong> Calcola il profitto potenziale considerando:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Taker fee su entrambi gli exchange</li>
              <li>Withdrawal fee per trasferire fondi</li>
              <li>Slippage stimato (non incluso in questa versione semplificata)</li>
            </ul>
            <p>
              <strong>Nota:</strong> Nell'arbitraggio reale, bisogna considerare anche latenza di rete, 
              requisiti di capitale, rischio di controparte, e complessità di gestione multi-exchange.
            </p>
          </div>
        </section>

        {/* Final Disclaimer */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#1a1a2e', 
          borderRadius: '8px',
          border: '2px solid #ffa500',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ffa500', fontWeight: 'bold' }}>
            ⚠️ Questo strumento NON esegue operazioni reali. Solo simulazione educativa.
          </p>
        </div>
      </div>
    </Layout>
  );
}
