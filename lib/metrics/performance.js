/**
 * Performance metrics module
 * Functions for calculating Sharpe, Sortino, Calmar, and Information Ratios
 */

import { volatility, maxDrawdown, downsideDeviation } from './risk.js';
import { computeAnnualizedStats, sanitizeSeries } from './utils.js';

/**
 * Calculates Sharpe Ratio
 * @param {number[]} returns - Array of returns
 * @param {number} rf - Risk-free rate (annualized, default: 0)
 * @param {number} periodsPerYear - Number of periods per year (default: 252)
 * @returns {number} Sharpe Ratio
 */
export function sharpe(returns, rf = 0, periodsPerYear = 252) {
  const stats = computeAnnualizedStats(returns, periodsPerYear);

  if (stats.sanitized.length < 2) {
    return 0;
  }

  const vol = volatility(stats.sanitized, periodsPerYear);

  if (vol === 0) {
    return 0;
  }

  const sharpeRatio = (stats.annualizedReturn - rf) / vol;
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
  const stats = computeAnnualizedStats(returns, periodsPerYear);

  if (stats.sanitized.length < 2) {
    return 0;
  }

  const downsideDev = downsideDeviation(stats.sanitized, 0, periodsPerYear);

  if (downsideDev === 0) {
    return 0;
  }

  const sortinoRatio = (stats.annualizedReturn - rf) / downsideDev;
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
  const stats = computeAnnualizedStats(returns, periodsPerYear);

  if (stats.sanitized.length < 2) {
    return 0;
  }

  let mdd = maxDD;
  if (mdd === null) {
    const equity = buildEquityCurve(stats.sanitized);
    mdd = maxDrawdown(equity);
  }

  const absMDD = Math.abs(mdd);

  if (absMDD === 0) {
    return 0;
  }

  const calmarRatio = stats.annualizedReturn / absMDD;
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
  const activeSanitized = sanitizeSeries(activeReturns);
  const benchmarkSanitized = sanitizeSeries(benchmarkReturns);

  if (activeSanitized.length !== benchmarkSanitized.length || activeSanitized.length < 2) {
    return 0;
  }

  const excessReturns = activeSanitized.map((value, index) => value - benchmarkSanitized[index]);
  const stats = computeAnnualizedStats(excessReturns, periodsPerYear);

  if (stats.sanitized.length < 2) {
    return 0;
  }

  const trackingError = volatility(stats.sanitized, periodsPerYear);

  if (trackingError === 0) {
    return 0;
  }

  const ir = stats.annualizedReturn / trackingError;
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
  const stats = computeAnnualizedStats(returns, periodsPerYear);

  if (stats.sanitized.length < 2) {
    return {
      sharpe: 0,
      sortino: 0,
      calmar: 0,
      volatility: 0,
      downsideDeviation: 0,
      maxDrawdown: 0,
      annualizedReturn: 0,
      cumulativeReturn: 0,
    };
  }

  const equity = buildEquityCurve(stats.sanitized);
  const mdd = maxDrawdown(equity);
  const vol = volatility(stats.sanitized, periodsPerYear);
  const downsideDev = downsideDeviation(stats.sanitized, 0, periodsPerYear);
  const absMDD = Math.abs(mdd);

  const sharpeRatio = vol === 0 ? 0 : (stats.annualizedReturn - rf) / vol;
  const sortinoRatio = downsideDev === 0 ? 0 : (stats.annualizedReturn - rf) / downsideDev;
  const calmarRatio = absMDD === 0 ? 0 : stats.annualizedReturn / absMDD;

  return {
    sharpe: Number.isFinite(sharpeRatio) ? sharpeRatio : 0,
    sortino: Number.isFinite(sortinoRatio) ? sortinoRatio : 0,
    calmar: Number.isFinite(calmarRatio) ? calmarRatio : 0,
    volatility: Number.isFinite(vol) ? vol : 0,
    downsideDeviation: Number.isFinite(downsideDev) ? downsideDev : 0,
    maxDrawdown: Number.isFinite(mdd) ? mdd : 0,
    annualizedReturn: Number.isFinite(stats.annualizedReturn) ? stats.annualizedReturn : 0,
    cumulativeReturn: Number.isFinite(stats.cumulativeReturn) ? stats.cumulativeReturn : 0,
  };
}

/**
 * Builds an equity curve from a sanitized return series
 * @param {number[]} returns - Sanitized returns
 * @returns {number[]} Equity curve starting at 1
 */
function buildEquityCurve(returns) {
  const equity = [1];

  for (let i = 0; i < returns.length; i++) {
    const previous = equity[equity.length - 1];
    equity.push(previous * (1 + returns[i]));
  }

  return equity;
}
