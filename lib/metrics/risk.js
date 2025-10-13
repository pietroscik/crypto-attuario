/**
 * Risk metrics module
 * Functions for calculating volatility, drawdowns, VaR, and ES
 */

/**
 * Calculates annualized volatility from returns
 * @param {number[]} returns - Array of returns
 * @param {number} periodsPerYear - Number of periods per year (default: 252 for daily)
 * @returns {number} Annualized volatility
 */
export function volatility(returns, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  // Calculate mean
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Calculate variance
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);

  // Annualize
  const vol = Math.sqrt(variance * periodsPerYear);
  
  return Number.isFinite(vol) ? vol : 0;
}

/**
 * Calculates maximum drawdown from a price series
 * @param {number[]} series - Array of prices or cumulative returns
 * @returns {number} Maximum drawdown (negative value)
 */
export function maxDrawdown(series) {
  if (!Array.isArray(series) || series.length < 2) {
    return 0;
  }

  let maxDD = 0;
  let peak = series[0];

  for (let i = 1; i < series.length; i++) {
    if (series[i] > peak) {
      peak = series[i];
    }
    
    const dd = (series[i] - peak) / peak;
    if (dd < maxDD) {
      maxDD = dd;
    }
  }

  return maxDD;
}

/**
 * Calculates Value at Risk (VaR)
 * @param {number[]} returns - Array of returns
 * @param {number} alpha - Confidence level (default: 0.95)
 * @param {string} method - Calculation method: 'parametric', 'historical' (default: 'parametric')
 * @returns {number} VaR value (negative)
 */
export function VaR(returns, alpha = 0.95, method = 'parametric') {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  if (method === 'historical') {
    // Historical VaR: percentile of actual returns
    const sorted = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - alpha) * sorted.length);
    return sorted[index] || 0;
  }

  // Parametric VaR: assume normal distribution
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const std = Math.sqrt(variance);

  // Z-score for confidence level (approximation)
  const zScore = alpha === 0.95 ? 1.645 : (alpha === 0.99 ? 2.326 : 1.96);
  
  const var_ = mean - zScore * std;
  return Number.isFinite(var_) ? var_ : 0;
}

/**
 * Calculates Expected Shortfall (Conditional VaR)
 * @param {number[]} returns - Array of returns
 * @param {number} alpha - Confidence level (default: 0.95)
 * @param {string} method - Calculation method: 'parametric', 'historical' (default: 'parametric')
 * @returns {number} ES value (negative)
 */
export function ES(returns, alpha = 0.95, method = 'parametric') {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  if (method === 'historical') {
    // Historical ES: mean of returns below VaR threshold
    const var_ = VaR(returns, alpha, 'historical');
    const tailReturns = returns.filter(r => r <= var_);
    
    if (tailReturns.length === 0) {
      return var_;
    }
    
    return tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
  }

  // Parametric ES: closed-form for normal distribution
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const std = Math.sqrt(variance);

  // Z-score for confidence level
  const zScore = alpha === 0.95 ? 1.645 : (alpha === 0.99 ? 2.326 : 1.96);
  
  // ES formula for normal distribution
  const phi = Math.exp(-0.5 * zScore * zScore) / Math.sqrt(2 * Math.PI);
  const es = mean - std * phi / (1 - alpha);
  
  return Number.isFinite(es) ? es : 0;
}

/**
 * Calculates downside deviation (semi-volatility)
 * @param {number[]} returns - Array of returns
 * @param {number} threshold - Threshold return (default: 0)
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {number} Annualized downside deviation
 */
export function downsideDeviation(returns, threshold = 0, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  // Calculate downside variance
  const downsideReturns = returns.filter(r => r < threshold);
  
  if (downsideReturns.length === 0) {
    return 0;
  }

  const downsideVariance = downsideReturns.reduce((sum, r) => sum + Math.pow(r - threshold, 2), 0) / downsideReturns.length;
  
  // Annualize
  const downsideDev = Math.sqrt(downsideVariance * periodsPerYear);
  
  return Number.isFinite(downsideDev) ? downsideDev : 0;
}
