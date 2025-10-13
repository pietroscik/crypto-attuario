/**
 * Portfolio backtesting module
 * Walk-forward backtesting with rebalancing
 */

import { toPctReturns } from '../metrics/returns.js';

/**
 * Performs walk-forward backtesting with periodic rebalancing
 * @param {Object} pricesByAsset - Object with asset names as keys and price arrays as values
 * @param {string} rebalFreq - Rebalancing frequency: 'daily', 'weekly', 'monthly' (default: 'monthly')
 * @param {Function} strategyFn - Strategy function that returns weights given (prices, date_index)
 * @returns {Object} Backtest results with equity curve, returns, turnover, and metrics
 */
export function walkForward(pricesByAsset, rebalFreq = 'monthly', strategyFn) {
  // Validate inputs
  if (!pricesByAsset || typeof pricesByAsset !== 'object') {
    throw new Error('pricesByAsset must be an object');
  }

  const assetNames = Object.keys(pricesByAsset);
  if (assetNames.length === 0) {
    throw new Error('No assets provided');
  }

  // Get lengths and validate all have same length
  const lengths = assetNames.map(name => pricesByAsset[name].length);
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  
  if (minLength !== maxLength) {
    console.warn('Asset price series have different lengths, using minimum length');
  }

  const T = minLength;
  if (T < 2) {
    throw new Error('Insufficient price data');
  }

  // Determine rebalancing period
  let rebalPeriod;
  if (rebalFreq === 'daily') {
    rebalPeriod = 1;
  } else if (rebalFreq === 'weekly') {
    rebalPeriod = 5; // Assuming daily data, 5 trading days per week
  } else {
    rebalPeriod = 21; // Assuming daily data, ~21 trading days per month
  }

  // Initialize portfolio
  let weights = null;
  let portfolioValue = 100; // Start with 100 units
  const equity = [portfolioValue];
  const portfolioReturns = [];
  let totalTurnover = 0;
  let rebalCount = 0;

  // Walk forward through time
  for (let t = 1; t < T; t++) {
    // Rebalance if needed
    const shouldRebalance = t === 1 || (t % rebalPeriod === 0);
    
    if (shouldRebalance) {
      // Get current prices for all assets
      const currentPrices = {};
      assetNames.forEach(name => {
        currentPrices[name] = pricesByAsset[name].slice(0, t);
      });

      // Call strategy function to get new weights
      const newWeights = strategyFn(currentPrices, t);
      
      // Validate weights
      if (!Array.isArray(newWeights) || newWeights.length !== assetNames.length) {
        throw new Error(`Strategy function returned invalid weights at t=${t}`);
      }

      // Calculate turnover
      if (weights !== null) {
        const turnover = newWeights.reduce((sum, w, i) => sum + Math.abs(w - weights[i]), 0);
        totalTurnover += turnover;
        rebalCount++;
      }

      weights = newWeights;
    }

    // Calculate returns for this period
    let portfolioReturn = 0;
    assetNames.forEach((name, i) => {
      const prevPrice = pricesByAsset[name][t - 1];
      const currPrice = pricesByAsset[name][t];
      
      if (prevPrice > 0) {
        const assetReturn = (currPrice / prevPrice) - 1;
        portfolioReturn += weights[i] * assetReturn;
      }
    });

    // Update portfolio value
    portfolioValue *= (1 + portfolioReturn);
    equity.push(portfolioValue);
    portfolioReturns.push(portfolioReturn);
  }

  // Calculate metrics
  const avgTurnover = rebalCount > 0 ? totalTurnover / rebalCount : 0;
  const finalValue = equity[equity.length - 1];
  const totalReturn = (finalValue / equity[0]) - 1;

  return {
    equity,
    returns: portfolioReturns,
    turnover: avgTurnover,
    totalTurnover,
    rebalanceCount: rebalCount,
    finalValue,
    totalReturn,
  };
}

/**
 * Simple strategy: Equal weight
 * @param {Object} prices - Price history
 * @param {number} t - Current time index
 * @returns {number[]} Equal weights
 */
export function equalWeightStrategy(prices, t) {
  const n = Object.keys(prices).length;
  return Array(n).fill(1 / n);
}

/**
 * Helper to convert prices object to returns matrix
 * @param {Object} pricesByAsset - Object with price arrays
 * @returns {number[][]} Returns matrix (each row is an asset's returns)
 */
export function pricesToReturnsMatrix(pricesByAsset) {
  const assetNames = Object.keys(pricesByAsset);
  return assetNames.map(name => toPctReturns(pricesByAsset[name]));
}
