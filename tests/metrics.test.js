/**
 * Tests for metrics modules (returns, risk, performance)
 */

import { describe, it, expect } from 'vitest';
import { toPctReturns, toLogReturns, rolling, cumulativeReturns } from '../lib/metrics/returns';
import { volatility, maxDrawdown, VaR, ES, downsideDeviation } from '../lib/metrics/risk';
import { sharpe, sortino, calmar, informationRatio, calculateMetrics } from '../lib/metrics/performance';

describe('Returns Module', () => {
  describe('toPctReturns', () => {
    it('should calculate percentage returns correctly', () => {
      const prices = [100, 110, 105, 115];
      const returns = toPctReturns(prices);
      
      expect(returns).toHaveLength(3);
      expect(returns[0]).toBeCloseTo(0.10, 5); // 10% gain
      expect(returns[1]).toBeCloseTo(-0.0454545, 5); // ~-4.5% loss
      expect(returns[2]).toBeCloseTo(0.0952381, 5); // ~9.5% gain
    });

    it('should handle empty or single-element arrays', () => {
      expect(toPctReturns([])).toEqual([]);
      expect(toPctReturns([100])).toEqual([]);
    });

    it('should filter out invalid values', () => {
      const prices = [100, 110, 0, 120, NaN, 130];
      const returns = toPctReturns(prices);
      
      // Should skip returns involving invalid values
      expect(returns.length).toBeLessThan(prices.length - 1);
    });
  });

  describe('rolling', () => {
    it('should calculate rolling statistics', () => {
      const series = [1, 2, 3, 4, 5];
      const rollingMean = rolling(series, 3, (window) => 
        window.reduce((sum, x) => sum + x, 0) / window.length
      );
      
      expect(rollingMean).toHaveLength(3);
      expect(rollingMean[0]).toBeCloseTo(2, 5); // avg(1,2,3)
      expect(rollingMean[1]).toBeCloseTo(3, 5); // avg(2,3,4)
      expect(rollingMean[2]).toBeCloseTo(4, 5); // avg(3,4,5)
    });
  });
});

describe('Risk Module', () => {
  describe('volatility', () => {
    it('should calculate annualized volatility', () => {
      const returns = [0.01, -0.01, 0.02, -0.015, 0.005];
      const vol = volatility(returns, 252);

      expect(vol).toBeGreaterThan(0);
      expect(vol).toBeLessThan(1); // Should be reasonable
    });

    it('should return 0 for insufficient data', () => {
      expect(volatility([], 252)).toBe(0);
      expect(volatility([0.01], 252)).toBe(0);
    });

    it('should ignore non-finite values', () => {
      const returns = [0.01, NaN, 0.02, undefined, 0.015, Infinity, -0.005];
      const vol = volatility(returns, 252);

      expect(vol).toBeGreaterThan(0);
      expect(Number.isFinite(vol)).toBe(true);
    });
  });

  describe('maxDrawdown', () => {
    it('should calculate maximum drawdown correctly', () => {
      const equity = [100, 110, 105, 95, 100, 120];
      const mdd = maxDrawdown(equity);
      
      expect(mdd).toBeLessThan(0); // Drawdown is negative
      expect(mdd).toBeCloseTo(-0.136363, 5); // ~-13.6% from 110 to 95
    });

    it('should return 0 for monotonically increasing series', () => {
      const equity = [100, 110, 120, 130];
      const mdd = maxDrawdown(equity);
      
      expect(mdd).toBe(0);
    });
  });

  describe('VaR', () => {
    it('should calculate parametric VaR', () => {
      const returns = [-0.02, -0.015, -0.005, 0.01, 0.02, 0.03];
      const var95 = VaR(returns, 0.95, 'parametric');

      expect(var95).toBeLessThan(0);
      expect(var95).toBeCloseTo(-0.0294, 4);
    });

    it('should calculate historical VaR', () => {
      const returns = [-0.02, -0.015, -0.005, 0.01, 0.02, 0.03];
      const var95 = VaR(returns, 0.95, 'historical');

      expect(var95).toBeLessThan(0);
      expect(var95).toBeCloseTo(-0.02, 5);
    });
  });

  describe('ES', () => {
    it('should calculate parametric Expected Shortfall', () => {
      const returns = [-0.02, -0.015, -0.005, 0.01, 0.02, 0.03];
      const es95 = ES(returns, 0.95, 'parametric');

      expect(es95).toBeLessThan(0);
      expect(es95).toBeCloseTo(-0.0377, 4);
    });

    it('should calculate historical Expected Shortfall', () => {
      const returns = [-0.02, -0.015, -0.005, 0.01, 0.02, 0.03];
      const es95 = ES(returns, 0.95, 'historical');

      expect(es95).toBeLessThan(0);
      expect(es95).toBeCloseTo(-0.02, 5);
    });
  });
});

describe('Performance Module', () => {
  describe('sharpe', () => {
    it('should calculate Sharpe ratio correctly', () => {
      const returns = [0.01, 0.02, -0.01, 0.015, 0.005];
      const sharpeRatio = sharpe(returns, 0, 252);
      
      expect(sharpeRatio).toBeGreaterThan(0);
      expect(Number.isFinite(sharpeRatio)).toBe(true);
    });

    it('should return 0 for zero volatility', () => {
      const returns = [0.01, 0.01, 0.01, 0.01];
      const sharpeRatio = sharpe(returns, 0, 252);
      
      expect(sharpeRatio).toBe(0);
    });
  });

  describe('sortino', () => {
    it('should calculate Sortino ratio', () => {
      const returns = [0.01, 0.02, -0.01, 0.015, -0.005];
      const sortinoRatio = sortino(returns, 0, 252);
      
      expect(Number.isFinite(sortinoRatio)).toBe(true);
    });
  });

  describe('calmar', () => {
    it('should calculate Calmar ratio', () => {
      const returns = [0.01, 0.02, -0.03, 0.015, 0.005];
      const calmarRatio = calmar(returns, null, 252);
      
      expect(Number.isFinite(calmarRatio)).toBe(true);
    });
  });

  describe('informationRatio', () => {
    it('should calculate Information Ratio', () => {
      const portfolioReturns = [0.02, 0.015, -0.01, 0.03];
      const benchmarkReturns = [0.01, 0.01, -0.005, 0.02];
      const ir = informationRatio(portfolioReturns, benchmarkReturns, 252);
      
      expect(Number.isFinite(ir)).toBe(true);
    });

    it('should return 0 for mismatched lengths', () => {
      const portfolioReturns = [0.01, 0.02];
      const benchmarkReturns = [0.01];
      const ir = informationRatio(portfolioReturns, benchmarkReturns, 252);
      
      expect(ir).toBe(0);
    });
  });

  describe('calculateMetrics', () => {
    it('should calculate all metrics at once', () => {
      const returns = [0.01, 0.02, -0.01, 0.015, 0.005];
      const metrics = calculateMetrics(returns, 0, 252);

      expect(metrics).toHaveProperty('sharpe');
      expect(metrics).toHaveProperty('sortino');
      expect(metrics).toHaveProperty('calmar');
      expect(metrics).toHaveProperty('volatility');
      expect(metrics).toHaveProperty('downsideDeviation');
      expect(metrics).toHaveProperty('maxDrawdown');
      expect(metrics).toHaveProperty('annualizedReturn');
      expect(metrics).toHaveProperty('cumulativeReturn');

      expect(Number.isFinite(metrics.sharpe)).toBe(true);
      expect(Number.isFinite(metrics.sortino)).toBe(true);
      expect(Number.isFinite(metrics.volatility)).toBe(true);
      expect(Number.isFinite(metrics.annualizedReturn)).toBe(true);
      expect(Number.isFinite(metrics.cumulativeReturn)).toBe(true);
    });

    it('should handle invalid inputs gracefully', () => {
      const returns = [0.01, undefined, NaN, 0.02, null, 0.015];
      const metrics = calculateMetrics(returns, 0, 252);

      expect(metrics.sharpe).toBeGreaterThan(0);
      expect(metrics.volatility).toBeGreaterThan(0);
      expect(metrics.cumulativeReturn).toBeGreaterThan(0);
    });
  });
});
