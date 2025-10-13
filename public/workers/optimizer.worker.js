/**
 * Web Worker for portfolio optimization calculations
 * Offloads heavy computations to avoid blocking the main thread
 */

// Portfolio weight optimization functions (duplicated for worker context)

function equalWeight(n) {
  if (n <= 0) return [];
  return Array(n).fill(1 / n);
}

function portfolioVariance(weights, cov) {
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * cov[i][j];
    }
  }
  return variance;
}

function randomSimplex(n, bounds) {
  // Dirichlet-style simplex sampler for more uniform distribution
  const x = Array(n).fill(0).map(() => -Math.log(Math.random()));
  const s = x.reduce((a, b) => a + b, 0);
  let weights = x.map(v => v / s);
  
  // Apply bounds and renormalize
  weights = weights.map(w => Math.max(bounds[0], Math.min(bounds[1], w)));
  const boundedSum = weights.reduce((s, w) => s + w, 0);
  if (boundedSum > 0) {
    weights = weights.map(w => w / boundedSum);
  }
  return weights;
}

function riskParity(cov, maxIter = 100, tol = 1e-6) {
  const n = cov.length;
  if (n === 0 || !Array.isArray(cov[0]) || cov[0].length !== n) {
    return [];
  }

  let weights = Array(n).fill(1 / n);

  for (let iter = 0; iter < maxIter; iter++) {
    const oldWeights = [...weights];

    for (let i = 0; i < n; i++) {
      let marginalRisk = 0;
      for (let j = 0; j < n; j++) {
        marginalRisk += cov[i][j] * weights[j];
      }

      const targetRiskContrib = 1 / n;
      if (marginalRisk > 0) {
        weights[i] = targetRiskContrib / marginalRisk;
      }
    }

    const sumWeights = weights.reduce((sum, w) => sum + w, 0);
    if (sumWeights > 0) {
      weights = weights.map(w => w / sumWeights);
    }

    const change = oldWeights.reduce((sum, w, i) => sum + Math.abs(w - weights[i]), 0);
    if (change < tol) {
      break;
    }
  }

  return weights;
}

function maxSharpe(expRet, cov, rf = 0, bounds = [0, 1], numSamples = 2000) {
  const n = expRet.length;
  
  if (n === 0 || cov.length !== n || !Array.isArray(cov[0]) || cov[0].length !== n) {
    return [];
  }

  let bestWeights = equalWeight(n);
  let bestSharpe = -Infinity;

  for (let sample = 0; sample < numSamples; sample++) {
    const weights = randomSimplex(n, bounds);
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * expRet[i], 0);
    const portfolioVol = Math.sqrt(portfolioVariance(weights, cov));
    
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

// Worker message handler
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  // Handle terminate message
  if (type === 'terminate') {
    self.close();
    return;
  }
  
  try {
    let result;
    
    switch (type) {
      case 'riskParity':
        result = riskParity(data.cov, data.maxIter, data.tol);
        break;
        
      case 'maxSharpe':
        result = maxSharpe(data.expRet, data.cov, data.rf, data.bounds, data.numSamples);
        break;
        
      case 'equalWeight':
        result = equalWeight(data.n);
        break;
        
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
    
    self.postMessage({ success: true, result, type });
    
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error.message,
      type 
    });
  }
};
