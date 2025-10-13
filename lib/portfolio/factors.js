/**
 * Portfolio factors and signals module
 * Common factor models for portfolio construction
 */

/**
 * Calculates momentum score for assets based on past performance
 * @param {Object} prices - Object with asset names as keys and price arrays as values
 * @param {number} lookback - Lookback period in days (default: 90)
 * @returns {Object} Object with asset names and momentum scores
 */
export function momentum(prices, lookback = 90) {
  const scores = {};
  
  Object.keys(prices).forEach(asset => {
    const series = prices[asset];
    
    if (series.length < lookback + 1) {
      scores[asset] = 0;
      return;
    }

    // Calculate return over lookback period
    const startPrice = series[series.length - lookback - 1];
    const endPrice = series[series.length - 1];
    
    if (startPrice > 0) {
      scores[asset] = (endPrice / startPrice) - 1;
    } else {
      scores[asset] = 0;
    }
  });

  return scores;
}

/**
 * Calculates carry score based on yields
 * @param {Object} yields - Object with asset names as keys and yield arrays as values
 * @param {number} lookback - Lookback period (default: 30)
 * @returns {Object} Object with asset names and carry scores
 */
export function carry(yields, lookback = 30) {
  const scores = {};
  
  Object.keys(yields).forEach(asset => {
    const series = yields[asset];
    
    if (series.length < lookback) {
      scores[asset] = 0;
      return;
    }

    // Calculate average yield over lookback period
    const recentYields = series.slice(-lookback);
    const avgYield = recentYields.reduce((sum, y) => sum + y, 0) / lookback;
    
    scores[asset] = avgYield;
  });

  return scores;
}

/**
 * Calculates volatility-targeted weights
 * Scales portfolio to target a specific volatility level
 * @param {number[]} returns - Portfolio returns
 * @param {number} target - Target annualized volatility (default: 0.10 = 10%)
 * @param {number} periodsPerYear - Periods per year (default: 252)
 * @returns {number} Scaling factor for weights
 */
export function volatilityTarget(returns, target = 0.10, periodsPerYear = 252) {
  if (!Array.isArray(returns) || returns.length < 2) {
    return 1;
  }

  // Calculate realized volatility
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const realizedVol = Math.sqrt(variance * periodsPerYear);

  if (realizedVol === 0) {
    return 1;
  }

  // Scaling factor
  const scale = target / realizedVol;
  
  // Limit scaling to reasonable bounds (0.1x to 2x)
  return Math.max(0.1, Math.min(2.0, scale));
}

/**
 * Combines multiple factor scores into a composite score
 * @param {Object[]} factors - Array of factor score objects
 * @param {number[]} weights - Weights for each factor (optional, equal by default)
 * @returns {Object} Combined scores
 */
export function combineFactors(factors, weights = null) {
  if (!Array.isArray(factors) || factors.length === 0) {
    return {};
  }

  // Default to equal weights
  if (!weights) {
    weights = Array(factors.length).fill(1 / factors.length);
  }

  // Get all asset names
  const allAssets = new Set();
  factors.forEach(factor => {
    Object.keys(factor).forEach(asset => allAssets.add(asset));
  });

  // Combine scores
  const combined = {};
  allAssets.forEach(asset => {
    let score = 0;
    for (let i = 0; i < factors.length; i++) {
      const factorScore = factors[i][asset] || 0;
      score += weights[i] * factorScore;
    }
    combined[asset] = score;
  });

  return combined;
}

/**
 * Ranks assets by factor scores and returns top N
 * @param {Object} scores - Factor scores by asset
 * @param {number} topN - Number of top assets to select
 * @returns {string[]} Array of top asset names
 */
export function rankAndSelect(scores, topN) {
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
  
  return sorted.map(([asset, _]) => asset);
}

/**
 * Calculates mean reversion score (inverse momentum)
 * @param {Object} prices - Price history
 * @param {number} lookback - Lookback period (default: 30)
 * @returns {Object} Mean reversion scores
 */
export function meanReversion(prices, lookback = 30) {
  const scores = {};
  
  Object.keys(prices).forEach(asset => {
    const series = prices[asset];
    
    if (series.length < lookback + 1) {
      scores[asset] = 0;
      return;
    }

    // Calculate moving average
    const recentPrices = series.slice(-lookback);
    const ma = recentPrices.reduce((sum, p) => sum + p, 0) / lookback;
    const currentPrice = series[series.length - 1];
    
    // Mean reversion score: negative of distance from MA
    scores[asset] = (ma - currentPrice) / ma;
  });

  return scores;
}
