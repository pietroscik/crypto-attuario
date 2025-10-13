/**
 * Efficient Frontier calculation module
 * Generates a synthetic efficient frontier by sampling portfolio weights
 */

import { equalWeight, riskParity, maxSharpe } from './weights.js';

/**
 * Generates random weights on simplex with bounds
 * @param {number} n - Number of assets
 * @param {number[]} bounds - Weight bounds [min, max]
 * @param {number} seed - Optional seed for reproducibility
 * @returns {number[]} Random weight vector
 */
function randomSimplex(n, bounds, seed) {
  // Simple seeded random if provided
  let randGen = Math.random;
  if (seed !== undefined) {
    let s = seed;
    randGen = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  // Dirichlet-style simplex sampler for more uniform distribution
  const x = Array(n).fill(0).map(() => -Math.log(randGen()));
  const sum = x.reduce((a, b) => a + b, 0);
  let weights = x.map(v => v / sum);
  
  // Apply bounds and renormalize
  weights = weights.map(w => Math.max(bounds[0], Math.min(bounds[1], w)));
  const boundedSum = weights.reduce((s, w) => s + w, 0);
  if (boundedSum > 0) {
    weights = weights.map(w => w / boundedSum);
  }
  
  return weights;
}

/**
 * Calculates portfolio variance
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
 * Generates efficient frontier points by sampling portfolio space
 * @param {number[]} expRet - Expected returns for each asset
 * @param {number[][]} cov - Covariance matrix (n x n)
 * @param {number} numSamples - Number of samples (default: 2000)
 * @param {number[]} bounds - Weight bounds [min, max] (default: [0, 1])
 * @param {number} seed - Optional seed for reproducibility
 * @returns {Object} Frontier data with sampled points and notable portfolios
 */
export function generateFrontier(expRet, cov, numSamples = 2000, bounds = [0, 1], seed) {
  const n = expRet.length;
  
  if (n === 0 || cov.length !== n) {
    return { points: [], equalWeight: null, riskParity: null, maxSharpe: null };
  }

  const points = [];
  
  // Sample random portfolios
  for (let i = 0; i < numSamples; i++) {
    const weights = randomSimplex(n, bounds, seed !== undefined ? seed + i : undefined);
    
    // Calculate expected return
    const portfolioReturn = weights.reduce((sum, w, j) => sum + w * expRet[j], 0);
    
    // Calculate risk (volatility)
    const portfolioVol = Math.sqrt(portfolioVariance(weights, cov));
    
    points.push({
      risk: portfolioVol,
      return: portfolioReturn,
      weights,
    });
  }

  // Calculate notable portfolios
  const ewWeights = equalWeight(n);
  const rpWeights = riskParity(cov);
  const msWeights = maxSharpe(expRet, cov, 0, bounds, 1000);

  const calculatePortfolio = (weights) => {
    const portfolioReturn = weights.reduce((sum, w, j) => sum + w * expRet[j], 0);
    const portfolioVol = Math.sqrt(portfolioVariance(weights, cov));
    return {
      risk: portfolioVol,
      return: portfolioReturn,
      sharpe: portfolioVol > 0 ? portfolioReturn / portfolioVol : 0,
      weights,
    };
  };

  return {
    points,
    equalWeight: calculatePortfolio(ewWeights),
    riskParity: calculatePortfolio(rpWeights),
    maxSharpe: calculatePortfolio(msWeights),
  };
}

/**
 * Exports frontier data to CSV format
 * @param {Object} frontierData - Frontier data from generateFrontier
 * @param {string[]} assetNames - Names of assets
 * @param {Object} metadata - Additional metadata (asOf, tradingDays, shrinkage)
 * @returns {string} CSV string
 */
export function exportFrontierCSV(frontierData, assetNames, metadata = {}) {
  const { points, equalWeight, riskParity, maxSharpe } = frontierData;
  
  // Metadata header
  const asOf = metadata.asOf || new Date().toISOString().split('T')[0];
  const tradingDays = metadata.tradingDays || 365;
  const shrinkage = metadata.shrinkage !== undefined ? metadata.shrinkage : 'N/A';
  
  let csv = `# Efficient Frontier Export\n`;
  csv += `# Generated: ${asOf}\n`;
  csv += `# Trading Days per Year: ${tradingDays}\n`;
  csv += `# Covariance Shrinkage (alpha): ${shrinkage}\n`;
  csv += `# Assets: ${assetNames.join(', ')}\n`;
  csv += `#\n`;
  
  // Data header
  const weightCols = assetNames.map(name => `Weight_${name}`).join(',');
  csv += `Risk,Return,Sharpe,Type,${weightCols}\n`;
  
  // Sample points
  points.forEach(p => {
    const sharpe = p.risk > 0 ? p.return / p.risk : 0;
    const weights = p.weights.map(w => w.toFixed(4)).join(',');
    csv += `${p.risk.toFixed(6)},${p.return.toFixed(6)},${sharpe.toFixed(4)},Sample,${weights}\n`;
  });
  
  // Notable portfolios
  const addPortfolio = (portfolio, type) => {
    if (portfolio) {
      const weights = portfolio.weights.map(w => w.toFixed(4)).join(',');
      csv += `${portfolio.risk.toFixed(6)},${portfolio.return.toFixed(6)},${portfolio.sharpe.toFixed(4)},${type},${weights}\n`;
    }
  };
  
  addPortfolio(equalWeight, 'EqualWeight');
  addPortfolio(riskParity, 'RiskParity');
  addPortfolio(maxSharpe, 'MaxSharpe');
  
  return csv;
}
