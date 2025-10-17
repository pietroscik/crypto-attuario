/**
 * Risk metrics module
 * Functions for calculating volatility, drawdowns, VaR, and ES
 */

import { clampAlpha, inverseStandardNormal, sanitizeSeries } from './utils.js';

/**
 * Calculates annualized volatility from returns
 * @param {number[]} returns - Array of returns
 * @param {number} periodsPerYear - Number of periods per year (default: 252 for daily)
 * @returns {number} Annualized volatility
 */
export function volatility(returns, periodsPerYear = 252) {
  const sanitized = sanitizeSeries(returns);

  if (sanitized.length < 2 || !Number.isFinite(periodsPerYear) || periodsPerYear <= 0) {
    return 0;
  }

  const mean = sanitized.reduce((sum, value) => sum + value, 0) / sanitized.length;
  const variance = sanitized.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    (sanitized.length - 1);
  const annualizedVariance = variance * periodsPerYear;

  const vol = Math.sqrt(Math.max(annualizedVariance, 0));
  return Number.isFinite(vol) ? vol : 0;
}

/**
 * Calculates maximum drawdown from a price series
 * @param {number[]} series - Array of prices or cumulative returns
 * @returns {number} Maximum drawdown (negative value)
 */
export function maxDrawdown(series) {
  const sanitized = sanitizeSeries(series);

  if (sanitized.length < 2) {
    return 0;
  }

  let maxDD = 0;
  let peak = null;

  for (let i = 0; i < sanitized.length; i++) {
    const value = sanitized[i];

    if (value > 0 && (peak === null || value > peak)) {
      peak = value;
    }

    if (peak === null || peak === 0) {
      continue;
    }

    const drawdown = (value - peak) / peak;
    if (drawdown < maxDD) {
      maxDD = drawdown;
    }
  }

  return Number.isFinite(maxDD) ? maxDD : 0;
}

/**
 * Calculates Value at Risk (VaR)
 * @param {number[]} returns - Array of returns
 * @param {number} alpha - Confidence level (default: 0.95)
 * @param {string} method - Calculation method: 'parametric', 'historical' (default: 'parametric')
 * @returns {number} VaR value (negative)
 */
export function VaR(returns, alpha = 0.95, method = 'parametric') {
  const sanitized = sanitizeSeries(returns);

  if (sanitized.length < 2) {
    return 0;
  }

  const clampedAlpha = clampAlpha(alpha);

  if (method === 'historical') {
    const sorted = [...sanitized].sort((a, b) => a - b);
    const index = Math.floor((1 - clampedAlpha) * sorted.length);
    const boundedIndex = Math.max(0, Math.min(sorted.length - 1, index));
    const varValue = sorted[boundedIndex];
    return Number.isFinite(varValue) ? varValue : 0;
  }

  const mean = sanitized.reduce((sum, value) => sum + value, 0) / sanitized.length;
  const variance = sanitized.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    (sanitized.length - 1);
  const std = Math.sqrt(Math.max(variance, 0));

  if (std === 0) {
    return Number.isFinite(mean) ? mean : 0;
  }

  const zScore = inverseStandardNormal(clampedAlpha);
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
  const sanitized = sanitizeSeries(returns);

  if (sanitized.length < 2) {
    return 0;
  }

  const clampedAlpha = clampAlpha(alpha);

  if (method === 'historical') {
    const varThreshold = VaR(sanitized, clampedAlpha, 'historical');
    const tailReturns = sanitized.filter((value) => value <= varThreshold);

    if (tailReturns.length === 0) {
      return Number.isFinite(varThreshold) ? varThreshold : 0;
    }

    const esValue = tailReturns.reduce((sum, value) => sum + value, 0) / tailReturns.length;
    return Number.isFinite(esValue) ? esValue : 0;
  }

  const mean = sanitized.reduce((sum, value) => sum + value, 0) / sanitized.length;
  const variance = sanitized.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    (sanitized.length - 1);
  const std = Math.sqrt(Math.max(variance, 0));

  if (std === 0) {
    return Number.isFinite(mean) ? mean : 0;
  }

  const zScore = inverseStandardNormal(clampedAlpha);
  const phi = Math.exp(-0.5 * zScore * zScore) / Math.sqrt(2 * Math.PI);
  const es = mean - (std * phi) / (1 - clampedAlpha);
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
  const sanitized = sanitizeSeries(returns);

  if (sanitized.length < 2 || !Number.isFinite(periodsPerYear) || periodsPerYear <= 0) {
    return 0;
  }

  const comparisonThreshold = Number.isFinite(threshold) ? threshold : 0;
  const downside = sanitized.filter((value) => value < comparisonThreshold);

  if (downside.length === 0) {
    return 0;
  }

  const variance = downside.reduce((sum, value) => sum + Math.pow(value - comparisonThreshold, 2), 0) /
    downside.length;
  const annualizedVariance = variance * periodsPerYear;
  const downsideDev = Math.sqrt(Math.max(annualizedVariance, 0));

  return Number.isFinite(downsideDev) ? downsideDev : 0;
}
