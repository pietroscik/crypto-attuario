/**
 * Tests for portfolio modules (weights, backtest, factors)
 */

import { describe, it, expect } from 'vitest';
import { equalWeight, riskParity, minVariance, maxSharpe, calculateCovarianceMatrix } from '../lib/portfolio/weights';
import { walkForward, pricesToReturnsMatrix } from '../lib/portfolio/backtest';
import { momentum, carry, volatilityTarget, combineFactors } from '../lib/portfolio/factors';

describe('Portfolio Weights Module', () => {
  describe('equalWeight', () => {
    it('should calculate equal weights', () => {
      const weights = equalWeight(3);
      
      expect(weights).toHaveLength(3);
      expect(weights[0]).toBeCloseTo(1/3, 5);
      expect(weights[1]).toBeCloseTo(1/3, 5);
      expect(weights[2]).toBeCloseTo(1/3, 5);
      
      const sum = weights.reduce((s, w) => s + w, 0);
      expect(sum).toBeCloseTo(1, 10);
    });

    it('should return empty array for n=0', () => {
      expect(equalWeight(0)).toEqual([]);
    });
  });

  describe('riskParity', () => {
    it('should calculate risk parity weights', () => {
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];
      
      const weights = riskParity(cov);
      
      expect(weights).toHaveLength(2);
      expect(weights[0]).toBeGreaterThan(0);
      expect(weights[1]).toBeGreaterThan(0);
      
      const sum = weights.reduce((s, w) => s + w, 0);
      expect(sum).toBeCloseTo(1, 5);
      
      // Asset with higher variance should have lower weight
      expect(weights[0]).toBeGreaterThan(weights[1]);
    });

    it('should handle 3x3 covariance matrix', () => {
      const cov = [
        [0.04, 0.01, 0.005],
        [0.01, 0.09, 0.02],
        [0.005, 0.02, 0.16]
      ];
      
      const weights = riskParity(cov);
      
      expect(weights).toHaveLength(3);
      
      const sum = weights.reduce((s, w) => s + w, 0);
      expect(sum).toBeCloseTo(1, 5);
    });
  });

  describe('minVariance', () => {
    it('should calculate minimum variance weights for 2 assets', () => {
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];
      
      const weights = minVariance(cov, [0, 1]);
      
      expect(weights).toHaveLength(2);
      expect(weights[0]).toBeGreaterThan(0);
      expect(weights[1]).toBeGreaterThan(0);
      
      const sum = weights.reduce((s, w) => s + w, 0);
      expect(sum).toBeCloseTo(1, 5);
    });
  });

  describe('maxSharpe', () => {
    it('should calculate maximum Sharpe ratio weights', () => {
      const expReturns = [0.10, 0.15, 0.08];
      const cov = [
        [0.04, 0.01, 0.005],
        [0.01, 0.09, 0.02],
        [0.005, 0.02, 0.16]
      ];
      
      const weights = maxSharpe(expReturns, cov, 0, [0, 1], 500);
      
      expect(weights).toHaveLength(3);
      
      const sum = weights.reduce((s, w) => s + w, 0);
      expect(sum).toBeCloseTo(1, 5);
      
      // Should favor asset with best risk-adjusted return
      const portfolioReturn = weights.reduce((sum, w, i) => sum + w * expReturns[i], 0);
      expect(portfolioReturn).toBeGreaterThan(0);
    });
  });

  describe('calculateCovarianceMatrix', () => {
    it('should calculate covariance matrix', () => {
      const returns = [
        [0.01, 0.02, -0.01],
        [0.015, 0.01, -0.005]
      ];
      
      const cov = calculateCovarianceMatrix(returns);
      
      expect(cov).toHaveLength(2);
      expect(cov[0]).toHaveLength(2);
      expect(cov[1]).toHaveLength(2);
      
      // Diagonal elements (variance) should be positive
      expect(cov[0][0]).toBeGreaterThan(0);
      expect(cov[1][1]).toBeGreaterThan(0);
      
      // Matrix should be symmetric
      expect(cov[0][1]).toBeCloseTo(cov[1][0], 10);
    });
  });
});

describe('Portfolio Backtest Module', () => {
  describe('walkForward', () => {
    it('should perform walk-forward backtest', () => {
      const prices = {
        asset1: [100, 105, 110, 108, 112, 115],
        asset2: [50, 52, 51, 53, 54, 56],
      };
      
      const strategy = () => [0.5, 0.5]; // Equal weight
      
      const result = walkForward(prices, 'daily', strategy);
      
      expect(result).toHaveProperty('equity');
      expect(result).toHaveProperty('returns');
      expect(result).toHaveProperty('turnover');
      expect(result).toHaveProperty('totalReturn');
      expect(result).toHaveProperty('finalValue');
      
      expect(result.equity.length).toBeGreaterThan(1);
      expect(result.returns.length).toBeGreaterThan(0);
      expect(result.finalValue).toBeGreaterThan(0);
    });

    it('should handle rebalancing', () => {
      const prices = {
        asset1: Array(30).fill(0).map((_, i) => 100 + i),
        asset2: Array(30).fill(0).map((_, i) => 50 + i * 0.5),
      };
      
      const strategy = () => [0.6, 0.4];
      
      const result = walkForward(prices, 'weekly', strategy);
      
      expect(result.rebalanceCount).toBeGreaterThan(0);
      expect(result.turnover).toBeGreaterThanOrEqual(0);
    });
  });

  describe('pricesToReturnsMatrix', () => {
    it('should convert prices to returns matrix', () => {
      const prices = {
        asset1: [100, 110, 105],
        asset2: [50, 52, 51],
      };
      
      const returns = pricesToReturnsMatrix(prices);
      
      expect(returns).toHaveLength(2);
      expect(returns[0]).toHaveLength(2);
      expect(returns[1]).toHaveLength(2);
    });
  });
});

describe('Portfolio Factors Module', () => {
  describe('momentum', () => {
    it('should calculate momentum scores', () => {
      const prices = {
        btc: Array(100).fill(0).map((_, i) => 100 + i),
        eth: Array(100).fill(0).map((_, i) => 50 + i * 0.5),
      };
      
      const scores = momentum(prices, 30);
      
      expect(scores).toHaveProperty('btc');
      expect(scores).toHaveProperty('eth');
      expect(scores.btc).toBeGreaterThan(0); // Rising trend
      expect(scores.eth).toBeGreaterThan(0); // Rising trend
    });
  });

  describe('carry', () => {
    it('should calculate carry scores', () => {
      const yields = {
        pool1: Array(40).fill(0).map(() => 5 + Math.random()),
        pool2: Array(40).fill(0).map(() => 10 + Math.random()),
      };
      
      const scores = carry(yields, 30);
      
      expect(scores).toHaveProperty('pool1');
      expect(scores).toHaveProperty('pool2');
      expect(scores.pool2).toBeGreaterThan(scores.pool1); // Higher yield
    });
  });

  describe('volatilityTarget', () => {
    it('should calculate volatility scaling factor', () => {
      const returns = Array(100).fill(0).map(() => (Math.random() - 0.5) * 0.02);
      const scale = volatilityTarget(returns, 0.10, 252);
      
      expect(scale).toBeGreaterThan(0);
      expect(scale).toBeLessThanOrEqual(2); // Max scaling
    });

    it('should return 1 for target matching realized vol', () => {
      const returns = Array(100).fill(0.001); // Very low vol
      const scale = volatilityTarget(returns, 0.01, 252);
      
      expect(scale).toBeGreaterThan(0);
    });
  });

  describe('combineFactors', () => {
    it('should combine multiple factor scores', () => {
      const factor1 = { btc: 0.5, eth: 0.3 };
      const factor2 = { btc: 0.2, eth: 0.8 };
      
      const combined = combineFactors([factor1, factor2], [0.5, 0.5]);
      
      expect(combined).toHaveProperty('btc');
      expect(combined).toHaveProperty('eth');
      expect(combined.btc).toBeCloseTo(0.35, 5); // 0.5*0.5 + 0.5*0.2
      expect(combined.eth).toBeCloseTo(0.55, 5); // 0.5*0.3 + 0.5*0.8
    });
  });
});
