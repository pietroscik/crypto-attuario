/**
 * Performance metrics module
 * Functions for calculating Sharpe, Sortino, Calmar, and Information Ratios
 */

import { volatility, maxDrawdown, downsideDeviation } from './risk.js';

/**
 * Calculates Sharpe Ratio
 * @param {number[]} returns - Array of returns
 * @param {number} rf - Risk-free rate (annualized, default: 0)
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {number} Sharpe Ratio
 */
export function sharpe(returns, rf = 0, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  // Calculate mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  
  // Annualize mean return
  const annualizedReturn = Math.pow(1 + meanReturn, periodsPerYear) - 1;
  
  // Calculate volatility
  const vol = volatility(returns, periodsPerYear);
  
  if (vol === 0) {
    return 0;
  }

  // Sharpe ratio
  const sharpeRatio = (annualizedReturn - rf) / vol;
  
  return Number.isFinite(sharpeRatio) ? sharpeRatio : 0;
}

/**
 * Calculates Sortino Ratio (uses downside deviation instead of total volatility)
 * @param {number[]} returns - Array of returns
 * @param {number} rf - Risk-free rate (annualized, default: 0)
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {number} Sortino Ratio
 */
export function sortino(returns, rf = 0, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  // Calculate mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  
  // Annualize mean return
  const annualizedReturn = Math.pow(1 + meanReturn, periodsPerYear) - 1;
  
  // Calculate downside deviation
  const downsideDev = downsideDeviation(returns, 0, periodsPerYear);
  
  if (downsideDev === 0) {
    return 0;
  }

  // Sortino ratio
  const sortinoRatio = (annualizedReturn - rf) / downsideDev;
  
  return Number.isFinite(sortinoRatio) ? sortinoRatio : 0;
}

/**
 * Calculates Calmar Ratio (return / max drawdown)
 * @param {number[]} returns - Array of returns
 * @param {number} maxDD - Maximum drawdown (if pre-calculated, optional)
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {number} Calmar Ratio
 */
export function calmar(returns, maxDD = null, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 0;
  }

  // Calculate mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  
  // Annualize mean return
  const annualizedReturn = Math.pow(1 + meanReturn, periodsPerYear) - 1;
  
  // Calculate or use provided max drawdown
  let mdd = maxDD;
  if (mdd === null) {
    // Convert returns to cumulative equity curve
    const equity = [1];
    for (let i = 0; i < returns.length; i++) {
      equity.push(equity[equity.length - 1] * (1 + returns[i]));
    }
    mdd = maxDrawdown(equity);
  }
  
  // Calmar ratio (absolute value of max drawdown)
  const absMDD = Math.abs(mdd);
  
  if (absMDD === 0) {
    return 0;
  }

  const calmarRatio = annualizedReturn / absMDD;
  
  return Number.isFinite(calmarRatio) ? calmarRatio : 0;
}

/**
 * Calculates Information Ratio (active return / tracking error)
 * @param {number[]} activeReturns - Array of portfolio returns
 * @param {number[]} benchmarkReturns - Array of benchmark returns
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {number} Information Ratio
 */
export function informationRatio(activeReturns, benchmarkReturns, periodsPerYear = 252) {
  if (!Array.isArray(activeReturns) || !Array.isArray(benchmarkReturns)) {
    return 0;
  }

  if (activeReturns.length !== benchmarkReturns.length || activeReturns.length < 2) {
    return 0;
  }

  // Calculate excess returns
  const excessReturns = activeReturns.map((r, i) => r - benchmarkReturns[i]);
  
  // Calculate mean excess return
  const meanExcess = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  
  // Annualize mean excess return
  const annualizedExcess = Math.pow(1 + meanExcess, periodsPerYear) - 1;
  
  // Calculate tracking error (volatility of excess returns)
  const trackingError = volatility(excessReturns, periodsPerYear);
  
  if (trackingError === 0) {
    return 0;
  }

  // Information ratio
  const ir = annualizedExcess / trackingError;
  
  return Number.isFinite(ir) ? ir : 0;
}

/**
 * Calculates multiple performance metrics at once
 * @param {number[]} returns - Array of returns
 * @param {number} rf - Risk-free rate (annualized, default: 0)
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {Object} Object with multiple metrics
 */
export function calculateMetrics(returns, rf = 0, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return {
      sharpe: 0,
      sortino: 0,
      calmar: 0,
      volatility: 0,
      downsideDeviation: 0,
      maxDrawdown: 0,
    };
  }

  // Build equity curve for max drawdown
  const equity = [1];
  for (let i = 0; i < returns.length; i++) {
    equity.push(equity[equity.length - 1] * (1 + returns[i]));
  }
  const mdd = maxDrawdown(equity);

  return {
    sharpe: sharpe(returns, rf, periodsPerYear),
    sortino: sortino(returns, rf, periodsPerYear),
    calmar: calmar(returns, mdd, periodsPerYear),
    volatility: volatility(returns, periodsPerYear),
    downsideDeviation: downsideDeviation(returns, 0, periodsPerYear),
    maxDrawdown: mdd,
  };
}
