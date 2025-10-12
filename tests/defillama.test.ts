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
  });
});
