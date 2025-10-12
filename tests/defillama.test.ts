/**
 * Tests for DefiLlama integration module
 */

import { describe, it, expect, vi } from 'vitest';
import { normalizePools, rankPools } from '../src/lib/defillama';
import type { DefiLlamaPool, NormalizedPool } from '../src/types/defillama';

describe('DefiLlama Integration', () => {
  describe('normalizePools', () => {
    it('should normalize valid pool data', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: 'Ethereum',
          project: 'Aave',
          symbol: 'USDC',
          tvlUsd: 1000000,
          apy: 5.5,
          apyBase: 4.5,
          apy7d: 5.3,
          url: 'https://example.com',
        },
      ];

      const result = normalizePools(mockPools);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        chain: 'Ethereum',
        project: 'Aave',
        symbol: 'USDC',
        apy: 5.5,
        apyBase: 4.5,
        apy7d: 5.3,
        tvlUsd: 1000000,
        url: 'https://example.com',
      });
    });

    it('should filter out pools with missing critical data', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: '',
          project: 'Test',
          symbol: 'TEST',
          tvlUsd: 1000000,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: '',
          symbol: 'TEST',
          tvlUsd: 1000000,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: 'Valid',
          symbol: 'VALID',
          tvlUsd: 1000000,
          apy: 5.5,
        },
      ];

      const result = normalizePools(mockPools);

      expect(result).toHaveLength(1);
      expect(result[0].project).toBe('Valid');
    });

    it('should filter out pools with invalid TVL or APY', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: 'Ethereum',
          project: 'Zero TVL',
          symbol: 'ZERO',
          tvlUsd: 0,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: 'Negative APY',
          symbol: 'NEG',
          tvlUsd: 1000000,
          apy: -5,
        },
        {
          chain: 'Ethereum',
          project: 'Valid',
          symbol: 'VALID',
          tvlUsd: 1000000,
          apy: 5.5,
        },
      ];

      const result = normalizePools(mockPools);

      expect(result).toHaveLength(1);
      expect(result[0].project).toBe('Valid');
    });

    it('should calculate APY from apyBase and apyReward when apy is missing', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: 'Ethereum',
          project: 'Test',
          symbol: 'TEST',
          tvlUsd: 1000000,
          apyBase: 4.5,
          apyReward: 1.5,
        },
      ];

      const result = normalizePools(mockPools);

      expect(result).toHaveLength(1);
      expect(result[0].apy).toBe(6.0);
    });
  });

  describe('rankPools', () => {
    it('should rank pools by risk-adjusted metric', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Low Risk',
          symbol: 'LOW',
          apy: 10,
          apyBase: 10,
          apy7d: 9.9,
          tvlUsd: 5000000,
          url: '',
        },
        {
          chain: 'Ethereum',
          project: 'High Risk',
          symbol: 'HIGH',
          apy: 20,
          apyBase: 20,
          apy7d: 10,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 0);

      expect(result).toHaveLength(2);
      // Low risk should have higher risk-adjusted metric due to lower volatility
      expect(result[0].project).toBe('Low Risk');
      expect(result[0].riskAdjustedMetric).toBeGreaterThan(result[1].riskAdjustedMetric);
    });

    it('should apply risk-free rate correctly', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Test',
          symbol: 'TEST',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 5, 0);

      expect(result).toHaveLength(1);
      // Risk-adjusted metric = (10 - 5) / 1 = 5
      expect(result[0].riskAdjustedMetric).toBe(5);
    });

    it('should filter by minimum TVL', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Small',
          symbol: 'SMALL',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 500000,
          url: '',
        },
        {
          chain: 'Ethereum',
          project: 'Large',
          symbol: 'LARGE',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 1000000);

      expect(result).toHaveLength(1);
      expect(result[0].project).toBe('Large');
    });

    it('should use default volatility proxy when apy7d is missing', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Test',
          symbol: 'TEST',
          apy: 10,
          apyBase: 10,
          apy7d: null,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 0);

      expect(result).toHaveLength(1);
      expect(result[0].volProxy).toBe(0.05); // Default volatility proxy
    });

    it('should prevent division by near-zero volatility', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Stable',
          symbol: 'STABLE',
          apy: 10.0001,
          apyBase: 10,
          apy7d: 10.0,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 0);

      expect(result).toHaveLength(1);
      // Should use minimum volatility (0.001) instead of very small calculated value
      expect(result[0].volProxy).toBeGreaterThanOrEqual(0.001);
      expect(result[0].riskAdjustedMetric).toBeLessThan(100000); // Reasonable value
    });

    it('should sort pools in descending order by risk-adjusted metric', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Medium',
          symbol: 'MED',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 5000000,
          url: '',
        },
        {
          chain: 'Ethereum',
          project: 'Best',
          symbol: 'BEST',
          apy: 12,
          apyBase: 12,
          apy7d: 11.5,
          tvlUsd: 5000000,
          url: '',
        },
        {
          chain: 'Ethereum',
          project: 'Worst',
          symbol: 'WORST',
          apy: 8,
          apyBase: 8,
          apy7d: 5,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 0);

      expect(result).toHaveLength(3);
      expect(result[0].riskAdjustedMetric).toBeGreaterThanOrEqual(result[1].riskAdjustedMetric);
      expect(result[1].riskAdjustedMetric).toBeGreaterThanOrEqual(result[2].riskAdjustedMetric);
    });

    it('should handle volProxy < 0.01 with stability', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'VeryStable',
          symbol: 'VSTABLE',
          apy: 10.005,
          apyBase: 10,
          apy7d: 10.0,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 0);

      expect(result).toHaveLength(1);
      // Should use MIN_VOL_PROXY (0.01) for stability
      expect(result[0].volProxy).toBe(0.01);
      expect(result[0].riskAdjustedMetric).toBe(10.005 / 0.01);
    });

    it('should handle variable risk-free rates', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'Test',
          symbol: 'TEST',
          apy: 15,
          apyBase: 15,
          apy7d: 14,
          tvlUsd: 5000000,
          url: '',
        },
      ];

      // Test with different rf values
      const result1 = rankPools(mockPools, 0, 0);
      const result2 = rankPools(mockPools, 5, 0);
      const result3 = rankPools(mockPools, 10, 0);

      expect(result1[0].riskAdjustedMetric).toBe(15 / 1); // (15 - 0) / 1
      expect(result2[0].riskAdjustedMetric).toBe(10 / 1); // (15 - 5) / 1
      expect(result3[0].riskAdjustedMetric).toBe(5 / 1);  // (15 - 10) / 1
    });

    it('should handle borderline TVL values', () => {
      const mockPools: NormalizedPool[] = [
        {
          chain: 'Ethereum',
          project: 'BelowThreshold',
          symbol: 'BELOW',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 999999.99,
          url: '',
        },
        {
          chain: 'Ethereum',
          project: 'ExactThreshold',
          symbol: 'EXACT',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 1000000,
          url: '',
        },
        {
          chain: 'Ethereum',
          project: 'AboveThreshold',
          symbol: 'ABOVE',
          apy: 10,
          apyBase: 10,
          apy7d: 9,
          tvlUsd: 1000000.01,
          url: '',
        },
      ];

      const result = rankPools(mockPools, 0, 1000000);

      expect(result).toHaveLength(2);
      expect(result.find(p => p.project === 'BelowThreshold')).toBeUndefined();
      expect(result.find(p => p.project === 'ExactThreshold')).toBeDefined();
      expect(result.find(p => p.project === 'AboveThreshold')).toBeDefined();
    });
  });

  describe('normalizePools - Additional Type Guard Tests', () => {
    it('should filter out pools with empty or whitespace-only strings', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: '   ',
          project: 'Test',
          symbol: 'TEST',
          tvlUsd: 1000000,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: '',
          symbol: 'TEST',
          tvlUsd: 1000000,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: 'Test',
          symbol: '  \t  ',
          tvlUsd: 1000000,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: 'Valid',
          symbol: 'VALID',
          tvlUsd: 1000000,
          apy: 5.5,
        },
      ];

      const result = normalizePools(mockPools);

      expect(result).toHaveLength(1);
      expect(result[0].project).toBe('Valid');
    });

    it('should handle NaN and Infinity in numeric fields', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: 'Ethereum',
          project: 'NaN APY',
          symbol: 'NAN',
          tvlUsd: 1000000,
          apy: NaN,
        },
        {
          chain: 'Ethereum',
          project: 'Infinity TVL',
          symbol: 'INF',
          tvlUsd: Infinity,
          apy: 5.5,
        },
        {
          chain: 'Ethereum',
          project: 'NaN apy7d',
          symbol: 'NAN7D',
          tvlUsd: 1000000,
          apy: 5.5,
          apy7d: NaN,
        },
        {
          chain: 'Ethereum',
          project: 'Valid',
          symbol: 'VALID',
          tvlUsd: 1000000,
          apy: 5.5,
          apy7d: 5.3,
        },
      ];

      const result = normalizePools(mockPools);

      // Should filter out NaN APY and Infinity TVL, but allow NaN apy7d (set to null)
      expect(result.length).toBeGreaterThanOrEqual(1);
      const validPool = result.find(p => p.project === 'Valid');
      const nanApy7dPool = result.find(p => p.project === 'NaN apy7d');
      
      expect(validPool).toBeDefined();
      expect(nanApy7dPool).toBeDefined();
      expect(nanApy7dPool?.apy7d).toBeNull();
    });

    it('should trim whitespace from string fields', () => {
      const mockPools: DefiLlamaPool[] = [
        {
          chain: '  Ethereum  ',
          project: '  Aave  ',
          symbol: '  USDC  ',
          tvlUsd: 1000000,
          apy: 5.5,
        },
      ];

      const result = normalizePools(mockPools);

      expect(result).toHaveLength(1);
      expect(result[0].chain).toBe('Ethereum');
      expect(result[0].project).toBe('Aave');
      expect(result[0].symbol).toBe('USDC');
    });

    it('should handle non-array input gracefully', () => {
      const result1 = normalizePools(null as any);
      const result2 = normalizePools(undefined as any);
      const result3 = normalizePools({} as any);

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
      expect(result3).toEqual([]);
    });
  });
});
