/**
 * Enhanced tests for cache module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get, set, clear, getOrFetch } from '../lib/net/cache';

describe('Cache Module', () => {
  beforeEach(() => {
    clear();
  });

  describe('TTL expiration', () => {
    it('should return null after TTL expires', async () => {
      const key = 'test-ttl';
      const value = { data: 'test' };
      const ttl = 100; // 100ms

      set(key, value, ttl);

      // Should be available immediately
      expect(get(key)).toEqual(value);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be expired
      expect(get(key)).toBeNull();
    });

    it('should not expire before TTL', async () => {
      const key = 'test-no-expire';
      const value = { data: 'test' };
      const ttl = 200; // 200ms

      set(key, value, ttl);

      // Wait less than TTL
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should still be available
      expect(get(key)).toEqual(value);
    });

    it('should handle default TTL', () => {
      const key = 'test-default-ttl';
      const value = { data: 'test' };

      set(key, value); // Uses default 60000ms

      expect(get(key)).toEqual(value);
    });
  });

  describe('getOrFetch with caching', () => {
    it('should fetch and cache on first call', async () => {
      const key = 'fetch-test';
      const fetchFn = vi.fn(async () => ({ data: 'fetched' }));

      const result = await getOrFetch(key, fetchFn, 1000);

      expect(result).toEqual({ data: 'fetched' });
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should return cached value on second call', async () => {
      const key = 'fetch-cached';
      const fetchFn = vi.fn(async () => ({ data: 'fetched' }));

      const result1 = await getOrFetch(key, fetchFn, 1000);
      const result2 = await getOrFetch(key, fetchFn, 1000);

      expect(result1).toEqual(result2);
      expect(fetchFn).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should re-fetch after TTL expires', async () => {
      const key = 'fetch-refetch';
      let callCount = 0;
      const fetchFn = vi.fn(async () => ({ data: `fetch-${++callCount}` }));

      const result1 = await getOrFetch(key, fetchFn, 100);
      expect(result1).toEqual({ data: 'fetch-1' });

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      const result2 = await getOrFetch(key, fetchFn, 100);
      expect(result2).toEqual({ data: 'fetch-2' });
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      set('key1', 'value1');
      set('key2', 'value2');
      set('key3', 'value3');

      expect(get('key1')).toBe('value1');
      expect(get('key2')).toBe('value2');

      clear();

      expect(get('key1')).toBeNull();
      expect(get('key2')).toBeNull();
      expect(get('key3')).toBeNull();
    });
  });

  describe('multiple cache entries', () => {
    it('should handle independent TTLs', async () => {
      set('short', 'value-short', 100);
      set('long', 'value-long', 500);

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(get('short')).toBeNull(); // Expired
      expect(get('long')).toBe('value-long'); // Still valid
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      set('null-key', null);
      expect(get('null-key')).toBeNull();
    });

    it('should handle undefined values', () => {
      set('undefined-key', undefined);
      expect(get('undefined-key')).toBeUndefined();
    });

    it('should handle complex objects', () => {
      const complexValue = {
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' }
        },
        number: 42,
        string: 'test'
      };

      set('complex', complexValue);
      expect(get('complex')).toEqual(complexValue);
    });
  });
});
