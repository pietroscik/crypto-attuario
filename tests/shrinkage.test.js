/**
 * Tests for covariance shrinkage
 */

import { describe, it, expect } from 'vitest';
import { shrinkCov, calculateCovarianceMatrix } from '../lib/portfolio/weights';

describe('Covariance Shrinkage', () => {
  describe('shrinkCov', () => {
    it('should shrink covariance matrix toward diagonal', () => {
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      const shrunk = shrinkCov(cov, 0.5);

      // Diagonal elements should move toward average
      const avgVar = (0.04 + 0.09) / 2;
      expect(shrunk[0][0]).toBeGreaterThan(cov[0][0]);
      expect(shrunk[0][0]).toBeLessThan(avgVar);
      expect(shrunk[1][1]).toBeLessThan(cov[1][1]);
      expect(shrunk[1][1]).toBeGreaterThan(avgVar);

      // Off-diagonal should shrink toward zero
      expect(Math.abs(shrunk[0][1])).toBeLessThan(Math.abs(cov[0][1]));
      expect(Math.abs(shrunk[1][0])).toBeLessThan(Math.abs(cov[1][0]));

      // Matrix should remain symmetric
      expect(shrunk[0][1]).toBeCloseTo(shrunk[1][0], 10);
    });

    it('should return original matrix when alpha=0', () => {
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      const shrunk = shrinkCov(cov, 0);

      expect(shrunk[0][0]).toBeCloseTo(cov[0][0], 10);
      expect(shrunk[0][1]).toBeCloseTo(cov[0][1], 10);
      expect(shrunk[1][0]).toBeCloseTo(cov[1][0], 10);
      expect(shrunk[1][1]).toBeCloseTo(cov[1][1], 10);
    });

    it('should handle alpha=1 (full shrinkage)', () => {
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      const shrunk = shrinkCov(cov, 1.0);

      const avgVar = (0.04 + 0.09) / 2;

      // Diagonal should be average variance
      expect(shrunk[0][0]).toBeCloseTo(avgVar, 10);
      expect(shrunk[1][1]).toBeCloseTo(avgVar, 10);

      // Off-diagonal should be zero
      expect(shrunk[0][1]).toBeCloseTo(0, 10);
      expect(shrunk[1][0]).toBeCloseTo(0, 10);
    });

    it('should clamp alpha to [0, 1]', () => {
      const cov = [
        [0.04, 0.01],
        [0.01, 0.09]
      ];

      // Negative alpha should behave like 0
      const shrunk1 = shrinkCov(cov, -0.5);
      expect(shrunk1[0][0]).toBeCloseTo(cov[0][0], 10);

      // Alpha > 1 should behave like 1
      const shrunk2 = shrinkCov(cov, 1.5);
      const avgVar = (0.04 + 0.09) / 2;
      expect(shrunk2[0][0]).toBeCloseTo(avgVar, 10);
    });

    it('should handle 3x3 matrix', () => {
      const cov = [
        [0.04, 0.01, 0.005],
        [0.01, 0.09, 0.02],
        [0.005, 0.02, 0.16]
      ];

      const shrunk = shrinkCov(cov, 0.1);

      // Should maintain dimensions
      expect(shrunk).toHaveLength(3);
      expect(shrunk[0]).toHaveLength(3);

      // Should maintain symmetry
      expect(shrunk[0][1]).toBeCloseTo(shrunk[1][0], 10);
      expect(shrunk[0][2]).toBeCloseTo(shrunk[2][0], 10);
      expect(shrunk[1][2]).toBeCloseTo(shrunk[2][1], 10);

      // Diagonal should be positive
      expect(shrunk[0][0]).toBeGreaterThan(0);
      expect(shrunk[1][1]).toBeGreaterThan(0);
      expect(shrunk[2][2]).toBeGreaterThan(0);
    });

    it('should handle empty matrix', () => {
      const cov = [];
      const shrunk = shrinkCov(cov, 0.1);
      expect(shrunk).toEqual([]);
    });
  });

  describe('Integration with calculateCovarianceMatrix', () => {
    it('should work with calculated covariance matrix', () => {
      const returns = [
        [0.01, 0.02, -0.01, 0.015],
        [0.015, 0.01, -0.005, 0.02]
      ];

      const cov = calculateCovarianceMatrix(returns);
      const shrunk = shrinkCov(cov, 0.2);

      // Should produce valid covariance matrix
      expect(shrunk).toHaveLength(2);
      expect(shrunk[0]).toHaveLength(2);
      
      // Should be symmetric
      expect(shrunk[0][1]).toBeCloseTo(shrunk[1][0], 10);
      
      // Diagonal should be positive
      expect(shrunk[0][0]).toBeGreaterThan(0);
      expect(shrunk[1][1]).toBeGreaterThan(0);
    });
  });
});
