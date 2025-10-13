/**
 * Portfolio weight optimization module
 * Functions for calculating portfolio weights using different strategies
 */

/**
 * Calculates equal weights for n assets
 * @param {number} n - Number of assets
 * @returns {number[]} Array of equal weights
 */
export function equalWeight(n) {
  if (n <= 0) {
    return [];
  }
  return Array(n).fill(1 / n);
}

/**
 * Calculates risk parity weights based on covariance matrix
 * Uses simple iterative coordinate descent algorithm
 * @param {number[][]} cov - Covariance matrix (n x n)
 * @param {number} maxIter - Maximum iterations (default: 100)
 * @param {number} tol - Convergence tolerance (default: 1e-6)
 * @returns {number[]} Array of risk parity weights
 */
export function riskParity(cov, maxIter = 100, tol = 1e-6) {
  const n = cov.length;
  
  if (n === 0 || !Array.isArray(cov[0]) || cov[0].length !== n) {
    return [];
  }

  // Initialize with equal weights
  let weights = Array(n).fill(1 / n);

  for (let iter = 0; iter < maxIter; iter++) {
    const oldWeights = [...weights];

    // Coordinate descent: update each weight
    for (let i = 0; i < n; i++) {
      // Calculate portfolio volatility contribution from asset i
      let marginalRisk = 0;
      for (let j = 0; j < n; j++) {
        marginalRisk += cov[i][j] * weights[j];
      }

      // Target risk contribution is 1/n of total
      const targetRiskContrib = 1 / n;
      
      // Update weight: simple fixed-point iteration
      if (marginalRisk > 0) {
        weights[i] = targetRiskContrib / marginalRisk;
      }
    }

    // Normalize weights to sum to 1
    const sumWeights = weights.reduce((sum, w) => sum + w, 0);
    if (sumWeights > 0) {
      weights = weights.map(w => w / sumWeights);
    }

    // Check convergence
    const change = oldWeights.reduce((sum, w, i) => sum + Math.abs(w - weights[i]), 0);
    if (change < tol) {
      break;
    }
  }

  return weights;
}

/**
 * Calculates minimum variance weights using grid search
 * @param {number[][]} cov - Covariance matrix (n x n)
 * @param {number[]} bounds - Weight bounds [min, max] (default: [0, 1])
 * @param {number} gridPoints - Number of grid points per dimension (default: 20)
 * @returns {number[]} Array of minimum variance weights
 */
export function minVariance(cov, bounds = [0, 1], gridPoints = 20) {
  const n = cov.length;
  
  if (n === 0 || !Array.isArray(cov[0]) || cov[0].length !== n) {
    return [];
  }

  // For n=2, use closed-form solution
  if (n === 2) {
    const var1 = cov[0][0];
    const var2 = cov[1][1];
    const covar = cov[0][1];
    
    const w1 = (var2 - covar) / (var1 + var2 - 2 * covar);
    const clampedW1 = Math.max(bounds[0], Math.min(bounds[1], w1));
    const clampedW2 = 1 - clampedW1;
    
    return [clampedW1, clampedW2];
  }

  // For n>2, use coarse grid search
  let bestWeights = equalWeight(n);
  let bestVar = portfolioVariance(bestWeights, cov);

  // Generate random weight combinations (simplex sampling)
  const numSamples = Math.min(1000, Math.pow(gridPoints, n - 1));
  
  for (let sample = 0; sample < numSamples; sample++) {
    // Generate random weights on simplex
    const weights = randomSimplex(n, bounds);
    
    // Calculate variance
    const variance = portfolioVariance(weights, cov);
    
    if (variance < bestVar) {
      bestVar = variance;
      bestWeights = weights;
    }
  }

  return bestWeights;
}

/**
 * Calculates maximum Sharpe ratio weights using grid search
 * @param {number[]} expRet - Expected returns for each asset
 * @param {number[][]} cov - Covariance matrix (n x n)
 * @param {number} rf - Risk-free rate (default: 0)
 * @param {number[]} bounds - Weight bounds [min, max] (default: [0, 1])
 * @param {number} numSamples - Number of random samples (default: 2000)
 * @returns {number[]} Array of maximum Sharpe weights
 */
export function maxSharpe(expRet, cov, rf = 0, bounds = [0, 1], numSamples = 2000) {
  const n = expRet.length;
  
  if (n === 0 || cov.length !== n || !Array.isArray(cov[0]) || cov[0].length !== n) {
    return [];
  }

  let bestWeights = equalWeight(n);
  let bestSharpe = -Infinity;

  // Random simplex search with adaptive refinement
  for (let sample = 0; sample < numSamples; sample++) {
    // Generate random weights on simplex
    const weights = randomSimplex(n, bounds);
    
    // Calculate expected return
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * expRet[i], 0);
    
    // Calculate volatility
    const portfolioVol = Math.sqrt(portfolioVariance(weights, cov));
    
    // Calculate Sharpe ratio
    if (portfolioVol > 0) {
      const sharpe = (portfolioReturn - rf) / portfolioVol;
      
      if (sharpe > bestSharpe) {
        bestSharpe = sharpe;
        bestWeights = weights;
      }
    }
  }

  return bestWeights;
}

/**
 * Helper: Calculate portfolio variance
 * @param {number[]} weights - Asset weights
 * @param {number[][]} cov - Covariance matrix
 * @returns {number} Portfolio variance
 */
function portfolioVariance(weights, cov) {
  let variance = 0;
  
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * cov[i][j];
    }
  }
  
  return variance;
}

/**
 * Helper: Generate random weights on simplex with bounds
 * @param {number} n - Number of assets
 * @param {number[]} bounds - Weight bounds [min, max]
 * @returns {number[]} Random weight vector
 */
function randomSimplex(n, bounds) {
  // Generate random numbers
  const rand = Array(n).fill(0).map(() => Math.random());
  
  // Normalize to sum to 1
  const sum = rand.reduce((s, r) => s + r, 0);
  let weights = rand.map(r => r / sum);
  
  // Apply bounds and renormalize
  weights = weights.map(w => Math.max(bounds[0], Math.min(bounds[1], w)));
  const boundedSum = weights.reduce((s, w) => s + w, 0);
  if (boundedSum > 0) {
    weights = weights.map(w => w / boundedSum);
  }
  
  return weights;
}

/**
 * Calculates covariance matrix from returns
 * @param {number[][]} returns - Array of return series (each series is an array)
 * @returns {number[][]} Covariance matrix
 */
export function calculateCovarianceMatrix(returns) {
  const n = returns.length;
  
  if (n === 0 || !Array.isArray(returns[0])) {
    return [];
  }

  const T = returns[0].length;
  
  // Calculate means
  const means = returns.map(series => 
    series.reduce((sum, r) => sum + r, 0) / T
  );

  // Calculate covariance
  const cov = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let t = 0; t < T; t++) {
        sum += (returns[i][t] - means[i]) * (returns[j][t] - means[j]);
      }
      cov[i][j] = sum / (T - 1);
    }
  }

  return cov;
}

/**
 * Applies covariance shrinkage (Ledoit-Wolf style) to improve stability
 * Shrinks the sample covariance matrix toward a structured target (diagonal)
 * @param {number[][]} cov - Sample covariance matrix (n x n)
 * @param {number} alpha - Shrinkage intensity [0, 1] (default: 0.10)
 * @returns {number[][]} Shrunk covariance matrix
 */
export function shrinkCov(cov, alpha = 0.10) {
  const n = cov.length;
  
  if (n === 0 || !Array.isArray(cov[0]) || cov[0].length !== n) {
    return cov;
  }
  
  // Clamp alpha to [0, 0.30] as per UI constraints
  const clampedAlpha = Math.max(0, Math.min(0.30, alpha));
  
  // Target: diagonal matrix with average variance
  const avgVar = cov.reduce((sum, row, i) => sum + row[i], 0) / n;
  
  // Shrink: (1 - alpha) * cov + alpha * target
  const shrunk = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        // Diagonal: shrink toward average variance
        shrunk[i][j] = (1 - clampedAlpha) * cov[i][j] + clampedAlpha * avgVar;
      } else {
        // Off-diagonal: shrink toward zero (ensure symmetry)
        shrunk[i][j] = (1 - clampedAlpha) * cov[i][j];
        shrunk[j][i] = shrunk[i][j]; // Explicitly maintain symmetry
      }
    }
  }
  
  return shrunk;
}
