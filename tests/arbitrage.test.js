/**
 * Tests for arbitrage strategies module
 */

import { describe, it, expect } from 'vitest';
import { scanPairs, calculateSlippage, formatOpportunity } from '../lib/strategies/arbitrage';

describe('Arbitrage Module', () => {
  describe('scanPairs', () => {
    it('should identify arbitrage opportunities', () => {
      const quotes = {
        Binance: {
          bid: 100,
          ask: 101,
          volume: 1000,
          timestamp: Date.now(),
        },
        Coinbase: {
          bid: 102,
          ask: 103,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      expect(Array.isArray(opportunities)).toBe(true);
      
      if (opportunities.length > 0) {
        const opp = opportunities[0];
        expect(opp).toHaveProperty('buyVenue');
        expect(opp).toHaveProperty('sellVenue');
        expect(opp).toHaveProperty('grossSpread');
        expect(opp).toHaveProperty('netSpread');
        expect(opp).toHaveProperty('estimatedProfit');
        expect(opp).toHaveProperty('simulated');
        expect(opp.simulated).toBe(true);
      }
    });

    it('should filter opportunities below minimum spread', () => {
      const quotes = {
        Venue1: {
          bid: 100,
          ask: 100.1,
          volume: 1000,
          timestamp: Date.now(),
        },
        Venue2: {
          bid: 100.05,
          ask: 100.15,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.01, // 1% minimum
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      // Small spread should be filtered out
      expect(opportunities.length).toBe(0);
    });

    it('should handle conservative vs optimistic fee models', () => {
      const quotes = {
        Venue1: {
          bid: 100,
          ask: 101,
          volume: 1000,
          timestamp: Date.now(),
        },
        Venue2: {
          bid: 103,
          ask: 104,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const oppConservative = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      const oppOptimistic = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'optimistic',
        maxSize: 1000,
      });
      
      // Optimistic should find more or equal opportunities
      expect(oppOptimistic.length).toBeGreaterThanOrEqual(oppConservative.length);
    });

    it('should reject invalid quotes', () => {
      const quotes = {
        Venue1: {
          bid: 100,
          ask: 99, // Invalid: ask < bid
          volume: 1000,
          timestamp: Date.now(),
        },
        Venue2: {
          bid: 100,
          ask: 101,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      // Should skip invalid venue
      expect(opportunities.length).toBe(0);
    });

    it('should handle missing volume data', () => {
      const quotes = {
        Venue1: {
          bid: 100,
          ask: 101,
          // volume missing
          timestamp: Date.now(),
        },
        Venue2: {
          bid: 103,
          ask: 104,
          // volume missing
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      // Should use maxSize as fallback
      if (opportunities.length > 0) {
        expect(opportunities[0].size).toBeLessThanOrEqual(1000);
      }
    });

    it('should sort opportunities by net spread', () => {
      const quotes = {
        Venue1: {
          bid: 100,
          ask: 101,
          volume: 1000,
          timestamp: Date.now(),
        },
        Venue2: {
          bid: 103,
          ask: 104,
          volume: 1000,
          timestamp: Date.now(),
        },
        Venue3: {
          bid: 102,
          ask: 102.5,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      // Check descending order
      for (let i = 1; i < opportunities.length; i++) {
        expect(opportunities[i-1].netSpread).toBeGreaterThanOrEqual(opportunities[i].netSpread);
      }
    });
  });

  describe('calculateSlippage', () => {
    it('should calculate slippage impact', () => {
      const basePrice = 100;
      const size = 100;
      const liquidity = 1000;
      
      const priceWithSlippage = calculateSlippage(size, liquidity, basePrice);
      
      expect(priceWithSlippage).toBeGreaterThan(basePrice);
      expect(priceWithSlippage).toBeLessThanOrEqual(basePrice * 1.05); // Max 5%
    });

    it('should return base price for zero liquidity', () => {
      const basePrice = 100;
      const price = calculateSlippage(100, 0, basePrice);
      
      expect(price).toBe(basePrice);
    });

    it('should cap slippage at 5%', () => {
      const basePrice = 100;
      const size = 1000;
      const liquidity = 100; // Very low liquidity
      
      const priceWithSlippage = calculateSlippage(size, liquidity, basePrice);
      
      expect(priceWithSlippage).toBeLessThanOrEqual(basePrice * 1.05);
    });
  });

  describe('formatOpportunity', () => {
    it('should format opportunity for display', () => {
      const opp = {
        buyVenue: 'Binance',
        sellVenue: 'Coinbase',
        buyPrice: 100,
        sellPrice: 102,
        netSpread: 0.015,
        estimatedProfit: 15,
      };
      
      const formatted = formatOpportunity(opp);
      
      expect(formatted).toContain('Binance');
      expect(formatted).toContain('Coinbase');
      expect(formatted).toContain('100.00');
      expect(formatted).toContain('102.00');
      expect(formatted).toContain('1.50%');
      expect(formatted).toContain('15.00');
      expect(formatted).toContain('SIMULATED');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty quotes object', () => {
      const opportunities = scanPairs({}, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      expect(opportunities).toEqual([]);
    });

    it('should handle single venue', () => {
      const quotes = {
        OnlyVenue: {
          bid: 100,
          ask: 101,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      expect(opportunities).toEqual([]);
    });

    it('should handle extreme price differences', () => {
      const quotes = {
        Venue1: {
          bid: 100,
          ask: 101,
          volume: 1000,
          timestamp: Date.now(),
        },
        Venue2: {
          bid: 150,
          ask: 151,
          volume: 1000,
          timestamp: Date.now(),
        },
      };
      
      const opportunities = scanPairs(quotes, {
        minSpread: 0.001,
        feeModel: 'conservative',
        maxSize: 1000,
      });
      
      // Should find large spread opportunities
      expect(opportunities.length).toBeGreaterThan(0);
      if (opportunities.length > 0) {
        expect(opportunities[0].grossSpread).toBeGreaterThan(0.3); // >30% spread
      }
    });
  });
});
