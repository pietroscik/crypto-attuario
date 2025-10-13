/**
 * Tests for efficient frontier module
 */

import { describe, it, expect } from 'vitest';
import { generateFrontier, exportFrontierCSV } from '../lib/portfolio/frontier';

describe('Efficient Frontier Module', () => {
  describe('generateFrontier', () => {
    it('should generate frontier with sample points', () => {
      const expRet = [0.10, 0.15, 0.08];
      const cov = [
        [0.04, 0.01, 0.005],
        [0.01, 0.09, 0.02],
        [0.005, 0.02, 0.16]
      ];

      const frontier = generateFrontier(expRet, cov, 100, [0, 1], 12345);

      expect(frontier.points).toHaveLength(100);
      expect(frontier.equalWeight).toBeDefined();
      expect(frontier.riskParity).toBeDefined();
      expect(frontier.maxSharpe).toBeDefined();

      // Check that points have required properties
      frontier.points.forEach(point => {
        expect(point).toHaveProperty('risk');
        expect(point).toHaveProperty('return');
        expect(point).toHaveProperty('weights');
        expect(point.risk).toBeGreaterThanOrEqual(0);
      });
    });

    it('should generate deterministic results with seed', () => {
      const expRet = [0.10, 0.15];
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      const frontier1 = generateFrontier(expRet, cov, 50, [0, 1], 42);
      const frontier2 = generateFrontier(expRet, cov, 50, [0, 1], 42);

      // First points should be identical
      expect(frontier1.points[0].risk).toBeCloseTo(frontier2.points[0].risk, 10);
      expect(frontier1.points[0].return).toBeCloseTo(frontier2.points[0].return, 10);
    });

    it('should handle empty inputs gracefully', () => {
      const frontier = generateFrontier([], [], 100);

      expect(frontier.points).toEqual([]);
      expect(frontier.equalWeight).toBeNull();
      expect(frontier.riskParity).toBeNull();
      expect(frontier.maxSharpe).toBeNull();
    });

    it('should respect weight bounds', () => {
      const expRet = [0.10, 0.15, 0.08];
      const cov = [
        [0.04, 0.01, 0.005],
        [0.01, 0.09, 0.02],
        [0.005, 0.02, 0.16]
      ];

      const frontier = generateFrontier(expRet, cov, 100, [0, 1]);

      frontier.points.forEach(point => {
        point.weights.forEach(w => {
          expect(w).toBeGreaterThanOrEqual(0);
          expect(w).toBeLessThanOrEqual(1);
        });
        
        // Weights should sum to 1
        const sum = point.weights.reduce((s, w) => s + w, 0);
        expect(sum).toBeCloseTo(1, 5);
      });
    });

    it('should calculate notable portfolios correctly', () => {
      const expRet = [0.10, 0.15];
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      const frontier = generateFrontier(expRet, cov, 100, [0, 1]);

      // Equal weight should have weights close to 0.5, 0.5
      expect(frontier.equalWeight.weights[0]).toBeCloseTo(0.5, 5);
      expect(frontier.equalWeight.weights[1]).toBeCloseTo(0.5, 5);

      // Risk parity should favor lower variance asset
      expect(frontier.riskParity.weights[0]).toBeGreaterThan(frontier.riskParity.weights[1]);

      // Max Sharpe should have valid Sharpe ratio
      expect(frontier.maxSharpe.sharpe).toBeGreaterThan(0);
    });
  });

  describe('exportFrontierCSV', () => {
    it('should export CSV with correct format', () => {
      const expRet = [0.10, 0.15];
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      const frontier = generateFrontier(expRet, cov, 10, [0, 1]);
      frontier.assetNames = ['BTC', 'ETH'];

      const csv = exportFrontierCSV(frontier, frontier.assetNames);

      // Check header
      expect(csv).toContain('Risk,Return,Sharpe,Type,Weight_BTC,Weight_ETH');

      // Check that notable portfolios are included
      expect(csv).toContain('EqualWeight');
      expect(csv).toContain('RiskParity');
      expect(csv).toContain('MaxSharpe');

      // Check sample points
      expect(csv).toContain('Sample');

      // Count lines (header + 10 samples + 3 notable)
      const lines = csv.trim().split('\n');
      expect(lines.length).toBe(14);
    });
  });
});
