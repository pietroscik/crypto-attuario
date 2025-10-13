/**
 * CoinGecko data connector with caching
 * Thin wrapper around CoinGecko public API endpoints
 */

import { fetchWithRetry } from '../net/request.js';
import { getOrFetch } from '../net/cache.js';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_TTL = 120000; // 120 seconds (CoinGecko free tier has rate limits)

/**
 * Fetches cryptocurrency market data
 * @param {Object} options - Query options
 * @param {string} options.vs - VS currency (default: 'usd')
 * @param {number} options.perPage - Results per page (default: 100, max: 250)
 * @param {number} options.page - Page number (default: 1)
 * @param {string} options.order - Sort order (default: 'market_cap_desc')
 * @returns {Promise<Array>} Array of market data objects
 */
export async function fetchMarkets(options = {}) {
  const {
    vs = 'usd',
    perPage = 100,
    page = 1,
    order = 'market_cap_desc',
  } = options;

  const params = new URLSearchParams({
    vs_currency: vs,
    per_page: Math.min(perPage, 250).toString(),
    page: page.toString(),
    order,
  });

  const cacheKey = `coingecko:markets:${params.toString()}`;
  
  return getOrFetch(
    cacheKey,
    async () => {
      const data = await fetchWithRetry(
        `${COINGECKO_BASE_URL}/coins/markets?${params.toString()}`
      );
      return data || [];
    },
    CACHE_TTL
  );
}

/**
 * Fetches simple price data for multiple cryptocurrencies
 * @param {string[]} ids - Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @param {string[]} vs - Array of VS currencies (default: ['usd'])
 * @param {boolean} includeChange - Include 24h change (default: true)
 * @returns {Promise<Object>} Object with coin prices
 */
export async function fetchSimplePrice(ids, vs = ['usd'], includeChange = true) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Invalid coin IDs array');
  }

  const params = new URLSearchParams({
    ids: ids.join(','),
    vs_currencies: vs.join(','),
    include_24hr_change: includeChange.toString(),
  });

  const cacheKey = `coingecko:price:${params.toString()}`;
  
  return getOrFetch(
    cacheKey,
    async () => {
      const data = await fetchWithRetry(
        `${COINGECKO_BASE_URL}/simple/price?${params.toString()}`
      );
      return data || {};
    },
    CACHE_TTL / 2 // 60 seconds for price data
  );
}

/**
 * Fetches market chart data (price history) for a cryptocurrency
 * @param {string} id - Coin ID (e.g., 'bitcoin')
 * @param {string} vs - VS currency (default: 'usd')
 * @param {number} days - Number of days (default: 90, max: 365)
 * @returns {Promise<Object>} Object with prices, market_caps, total_volumes arrays
 */
export async function fetchMarketChart(id, vs = 'usd', days = 90) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid coin ID');
  }

  const params = new URLSearchParams({
    vs_currency: vs,
    days: Math.min(days, 365).toString(),
  });

  const cacheKey = `coingecko:chart:${id}:${params.toString()}`;
  
  return getOrFetch(
    cacheKey,
    async () => {
      const data = await fetchWithRetry(
        `${COINGECKO_BASE_URL}/coins/${id}/market_chart?${params.toString()}`
      );
      return data || { prices: [], market_caps: [], total_volumes: [] };
    },
    CACHE_TTL * 2 // 4 minutes for chart data
  );
}

/**
 * Searches for cryptocurrencies by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching coins
 */
export async function searchCoins(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const cacheKey = `coingecko:search:${query.toLowerCase()}`;
  
  return getOrFetch(
    cacheKey,
    async () => {
      const data = await fetchWithRetry(
        `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`
      );
      return data?.coins || [];
    },
    CACHE_TTL * 5 // 10 minutes for search results
  );
}

/**
 * Fetches detailed coin information
 * @param {string} id - Coin ID
 * @returns {Promise<Object>} Detailed coin data
 */
export async function fetchCoinDetails(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid coin ID');
  }

  const cacheKey = `coingecko:coin:${id}`;
  
  return getOrFetch(
    cacheKey,
    async () => {
      const data = await fetchWithRetry(
        `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
      );
      return data || null;
    },
    CACHE_TTL * 3 // 6 minutes for detailed data
  );
}
