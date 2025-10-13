/**
 * Utilities Hub - Methodology
 * Documentation of formulas, assumptions, and caveats
 */

import Layout from '../../components/Layout';

export default function Methodology() {
  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
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
            Methodology
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c0c0c0' }}>
            Formulas, assumptions, and limitations of our quantitative tools
          </p>
        </header>

        {/* Content */}
        <div style={{ color: '#c0c0c0', lineHeight: 1.8 }}>
          
          {/* Returns and Annualization */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Returns and Annualization
            </h2>
            
            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Arithmetic Returns
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Simple percentage returns calculated as:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              r_t = (P_t - P_(t-1)) / P_(t-1)
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Log Returns
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Continuously compounded returns:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              r_t = ln(P_t / P_(t-1))
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Annualization
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Returns are annualized using geometric compounding:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Annual Return = (1 + mean_daily_return)^N - 1
            </code>
            <p>
              Where N is the number of trading periods per year:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
              <li><strong>252</strong>: Traditional markets (Mon-Fri, excluding holidays)</li>
              <li><strong>365</strong>: Crypto markets (24/7/365 trading)</li>
            </ul>
          </section>

          {/* Risk Metrics */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Risk Metrics
            </h2>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Volatility (Standard Deviation)
            </h3>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              σ = sqrt(Σ(r_t - μ)² / (n-1)) × sqrt(N)
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Maximum Drawdown (MDD)
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Largest peak-to-trough decline:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              MDD = max((peak - trough) / peak)
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Value at Risk (VaR)
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Historical VaR at confidence level α (typically 95% or 99%):
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              VaR_α = -percentile(returns, 1-α)
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Expected Shortfall (ES / CVaR)
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Average loss beyond VaR threshold:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              ES_α = E[Loss | Loss &gt; VaR_α]
            </code>
          </section>

          {/* Risk-Adjusted Metrics */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Risk-Adjusted Performance
            </h2>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Sharpe Ratio
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Excess return per unit of total risk:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Sharpe = (R_p - R_f) / σ_p
            </code>
            <p>
              Where R_p is portfolio return, R_f is risk-free rate (typically 0 for crypto), and σ_p is portfolio volatility.
            </p>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Sortino Ratio
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Similar to Sharpe, but penalizes only downside volatility:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Sortino = (R_p - R_f) / σ_downside
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Calmar Ratio
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Return relative to maximum drawdown:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Calmar = Annual_Return / |MDD|
            </code>
          </section>

          {/* Portfolio Optimization */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Portfolio Optimization
            </h2>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Equal Weight
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Simplest diversification strategy:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              w_i = 1/n for all assets
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Risk Parity
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Equalizes risk contribution from each asset. Solved iteratively:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Risk_Contrib_i = w_i × (Σ_w_j × Cov_ij)
              <br />
              Target: RC_i = 1/n for all i
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Maximum Sharpe Ratio
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Optimizes risk-adjusted returns using random simplex search (2000 samples):
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              max Sharpe = max (w'μ - r_f) / sqrt(w'Σw)
              <br />
              subject to: Σw_i = 1, 0 ≤ w_i ≤ 1
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Covariance Shrinkage
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Improves stability by shrinking sample covariance toward structured target:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Σ_shrunk = (1-α) × Σ_sample + α × Target
              <br />
              Target = diag(avg_variance)
            </code>
            <p>
              Default α = 0.10, adjustable via slider (0 to 0.30).
            </p>
          </section>

          {/* Backtesting */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Backtesting
            </h2>

            <p style={{ marginBottom: '1rem' }}>
              Walk-forward backtesting with periodic rebalancing (monthly by default).
              Tracks portfolio value, turnover, and generates return series for performance metrics.
            </p>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Portfolio Value Update
            </h3>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              V_(t+1) = Σ w_i × V_t × (1 + r_i,t)
            </code>

            <h3 style={{ color: '#7fffd4', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Turnover
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Measures trading activity at rebalancing:
            </p>
            <code style={{ 
              display: 'block', 
              background: '#11161d', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Turnover_t = Σ |w_target,i - w_actual,i|
            </code>
          </section>

          {/* Assumptions and Caveats */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Assumptions and Caveats
            </h2>

            <div style={{ 
              background: '#1a1a2e', 
              border: '1px solid #ff6b6b', 
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: '#ff6b6b', fontSize: '1.1rem', marginBottom: '1rem' }}>
                ⚠️ Important Limitations
              </h3>
              
              <ul style={{ marginLeft: '1.5rem', lineHeight: 2 }}>
                <li>
                  <strong>Historical data only:</strong> Past performance does not guarantee future results
                </li>
                <li>
                  <strong>Thin liquidity:</strong> Crypto markets can have low liquidity, high slippage
                </li>
                <li>
                  <strong>No transaction costs:</strong> Backtests don't include fees, slippage, or taxes
                </li>
                <li>
                  <strong>Stationarity assumption:</strong> Return distributions may change over time
                </li>
                <li>
                  <strong>Look-ahead bias:</strong> Some metrics may use information not available in real-time
                </li>
                <li>
                  <strong>Market microstructure:</strong> Ignores bid-ask spreads, market impact
                </li>
                <li>
                  <strong>Optimization bias:</strong> Grid/random search may not find true global optimum
                </li>
                <li>
                  <strong>Data quality:</strong> Relies on external APIs (CoinGecko, DeFiLlama)
                </li>
              </ul>
            </div>

            <div style={{ 
              background: '#11161d', 
              border: '1px solid #7fffd4', 
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#7fffd4', fontSize: '1.1rem', marginBottom: '1rem' }}>
                ℹ️ Best Practices
              </h3>
              
              <ul style={{ marginLeft: '1.5rem', lineHeight: 2 }}>
                <li>Use multiple time horizons for robustness checks</li>
                <li>Apply covariance shrinkage for stability (especially with &lt; 100 data points)</li>
                <li>Consider out-of-sample validation periods</li>
                <li>Monitor turnover to estimate realistic transaction costs</li>
                <li>Use 365 trading days for crypto, 252 for traditional assets</li>
                <li>Combine multiple risk metrics (Sharpe, Sortino, Calmar)</li>
                <li>Always maintain a risk management plan</li>
                <li>This tool is for educational purposes - not financial advice</li>
              </ul>
            </div>
          </section>

          {/* References */}
          <section>
            <h2 style={{ color: '#00ffcc', fontSize: '1.5rem', marginBottom: '1rem' }}>
              References
            </h2>
            
            <ul style={{ marginLeft: '1.5rem', lineHeight: 2, fontSize: '0.95rem' }}>
              <li>Ledoit, O., & Wolf, M. (2003). "Improved estimation of the covariance matrix of stock returns with an application to portfolio selection"</li>
              <li>Maillard, S., Roncalli, T., & Teïletche, J. (2010). "On the properties of equally-weighted risk contributions portfolios"</li>
              <li>Markowitz, H. (1952). "Portfolio Selection", Journal of Finance</li>
              <li>Sharpe, W. F. (1966). "Mutual Fund Performance", Journal of Business</li>
              <li>Sortino, F. A., & Price, L. N. (1994). "Performance Measurement in a Downside Risk Framework"</li>
            </ul>
          </section>

        </div>

        {/* Disclaimer */}
        <div style={{ 
          marginTop: '3rem',
          padding: '1.5rem', 
          background: '#1a1a2e', 
          borderRadius: '8px', 
          border: '1px solid #30363d',
          textAlign: 'center',
          color: '#c0c0c0'
        }}>
          <strong style={{ color: '#00ffcc' }}>Disclaimer:</strong> All tools and metrics are provided for educational 
          and informational purposes only. Nothing on this page constitutes financial advice, investment recommendations, 
          or an offer to buy/sell securities. Always conduct your own research and consult with qualified professionals.
        </div>
      </div>
    </Layout>
  );
}
