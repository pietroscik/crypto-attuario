/**
 * DeFiLlama data connector with caching
 * Thin wrapper around DefiLlama API endpoints
 */

import { fetchWithRetry } from '../net/request.js';
import { getOrFetch } from '../net/cache.js';

const DEFILLAMA_BASE_URL = 'https://api.llama.fi';
const DEFILLAMA_YIELDS_URL = 'https://yields.llama.fi';
const CACHE_TTL = 60000; // 60 seconds

/**
 * Fetches all DeFi protocols
 * @returns {Promise<Array>} Array of protocol objects
 */
export async function fetchProtocols() {
  return getOrFetch(
    'defillama:protocols',
    async () => {
      const data = await fetchWithRetry(`${DEFILLAMA_BASE_URL}/protocols`);
      return data || [];
    },
    CACHE_TTL
  );
}

/**
 * Fetches TVL data for a specific protocol
 * @param {string} protocolSlug - Protocol slug (e.g., 'aave', 'uniswap')
 * @returns {Promise<Object|null>} Protocol TVL data or null
 */
export async function fetchProtocolTVL(protocolSlug) {
  if (!protocolSlug || typeof protocolSlug !== 'string') {
    throw new Error('Invalid protocol slug');
  }

  return getOrFetch(
    `defillama:protocol:${protocolSlug}`,
    async () => {
      const data = await fetchWithRetry(`${DEFILLAMA_BASE_URL}/protocol/${protocolSlug}`);
      return data;
    },
    CACHE_TTL
  );
}

/**
 * Fetches yield data for DeFi pools
 * @param {Object} params - Query parameters
 * @param {string} params.chain - Filter by blockchain (optional)
 * @param {string} params.project - Filter by project (optional)
 * @param {string} params.symbol - Filter by symbol (optional)
 * @returns {Promise<Array>} Array of pool yield objects
 */
export async function fetchYields(params = {}) {
  const cacheKey = `defillama:yields:${JSON.stringify(params)}`;
  
  return getOrFetch(
    cacheKey,
    async () => {
      const data = await fetchWithRetry(`${DEFILLAMA_YIELDS_URL}/pools`);
      
      // Handle response format
      let pools = [];
      if (data && data.data && Array.isArray(data.data)) {
        pools = data.data;
      } else if (Array.isArray(data)) {
        pools = data;
      }

      // Apply filters if specified
      if (params.chain) {
        pools = pools.filter(p => p.chain && p.chain.toLowerCase() === params.chain.toLowerCase());
      }
      if (params.project) {
        pools = pools.filter(p => p.project && p.project.toLowerCase() === params.project.toLowerCase());
      }
      if (params.symbol) {
        pools = pools.filter(p => p.symbol && p.symbol.toLowerCase().includes(params.symbol.toLowerCase()));
      }

      return pools;
    },
    CACHE_TTL
  );
}

/**
 * Fetches historical TVL chart data for a protocol
 * @param {string} protocolSlug - Protocol slug
 * @returns {Promise<Array>} Array of {date, tvl} objects
 */
export async function fetchProtocolChart(protocolSlug) {
  if (!protocolSlug || typeof protocolSlug !== 'string') {
    throw new Error('Invalid protocol slug');
  }

  return getOrFetch(
    `defillama:chart:${protocolSlug}`,
    async () => {
      const data = await fetchProtocolTVL(protocolSlug);
      
      if (data && data.tvl && Array.isArray(data.tvl)) {
        return data.tvl.map(item => ({
          date: item.date,
          tvl: item.totalLiquidityUSD,
        }));
      }
      
      return [];
    },
    CACHE_TTL * 2 // 2 minutes for chart data
  );
}
