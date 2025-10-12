/**
 * DefiLlama API integration module
 * Provides data fetching and processing functions for DeFi protocols and pools
 */

import type {
  DefiLlamaPool,
  DefiLlamaProtocol,
  DefiLlamaProtocolsResponse,
  DefiLlamaPoolsResponse,
  NormalizedPool,
  RankedPool,
} from '../types/defillama';

const DEFAULT_API_URL = 'https://yields.llama.fi';

/**
 * Fetches JSON data from a given URL with error handling
 */
export async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
    }
    throw new Error(`Failed to fetch data from ${url}: Unknown error`);
  }
}

/**
 * Fetches a specific protocol by ID
 */
export async function getProtocol(
  protocolId: string
): Promise<DefiLlamaProtocol | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_DEFI_LLAMA_API_URL ||
      'https://api.llama.fi';
    const url = `${apiUrl}/protocol/${protocolId}`;
    const data = await fetchJSON<DefiLlamaProtocol>(url);
    return data;
  } catch (error) {
    console.error(`Error fetching protocol ${protocolId}:`, error);
    return null;
  }
}

/**
 * Fetches all protocols
 */
export async function getProtocols(): Promise<DefiLlamaProtocol[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_DEFI_LLAMA_API_URL ||
      'https://api.llama.fi';
    const url = `${apiUrl}/protocols`;
    const data = await fetchJSON<DefiLlamaProtocol[]>(url);
    return data;
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return [];
  }
}

/**
 * Fetches all available pools
 */
export async function getPools(): Promise<DefiLlamaPool[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_DEFI_LLAMA_API_URL || DEFAULT_API_URL;
    const url = `${apiUrl}/pools`;
    const data = await fetchJSON<DefiLlamaPoolsResponse>(url);
    
    // Handle both response formats
    if ('data' in data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // Fallback if data is directly an array
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching pools:', error);
    return [];
  }
}

/**
 * Normalizes pool data to a consistent format
 */
export function normalizePools(pools: DefiLlamaPool[]): NormalizedPool[] {
  return pools
    .map((pool) => {
      // Skip pools with missing critical data
      if (!pool.chain || !pool.project || !pool.symbol) {
        return null;
      }

      // Calculate APY: use apy if available, otherwise sum apyBase + apyReward
      let apy = pool.apy ?? 0;
      if (apy === 0 && pool.apyBase !== undefined) {
        apy = pool.apyBase + (pool.apyReward ?? 0);
      }

      // Skip pools with no TVL or negative/invalid APY
      if (!pool.tvlUsd || pool.tvlUsd <= 0 || apy < 0) {
        return null;
      }

      // Build URL: use provided url or construct from pool data
      let url = pool.url || '';
      if (!url && pool.pool) {
        url = `https://defillama.com/yields/pool/${pool.pool}`;
      }

      return {
        chain: pool.chain,
        project: pool.project,
        symbol: pool.symbol,
        apy: apy,
        apyBase: pool.apyBase ?? null,
        apy7d: pool.apy7d ?? null,
        tvlUsd: pool.tvlUsd,
        url: url,
      };
    })
    .filter((pool): pool is NormalizedPool => pool !== null);
}

/**
 * Ranks pools based on risk-adjusted metric
 * Risk-adjusted metric = (APY - rf) / volProxy
 * where volProxy = |apy - apy7d| with fallback to 0.05
 */
export function rankPools(
  pools: NormalizedPool[],
  riskFreeRate: number = 0,
  minTVL: number = 0
): RankedPool[] {
  const DEFAULT_VOL_PROXY = 0.05;
  const MIN_VOL_PROXY = 0.001; // Minimum volatility to prevent extreme values

  return pools
    .filter((pool) => pool.tvlUsd >= minTVL)
    .map((pool) => {
      // Calculate volatility proxy
      let volProxy = DEFAULT_VOL_PROXY;
      
      if (pool.apy7d !== null && !isNaN(pool.apy7d)) {
        const calculatedVol = Math.abs(pool.apy - pool.apy7d);
        // Use calculated volatility if it's reasonable, otherwise use default
        if (calculatedVol > 0) {
          volProxy = calculatedVol;
        }
      }

      // Apply minimum volatility to prevent division by near-zero
      volProxy = Math.max(volProxy, MIN_VOL_PROXY);

      // Calculate risk-adjusted metric (Sharpe-like ratio)
      const excessReturn = pool.apy - riskFreeRate;
      const riskAdjustedMetric = excessReturn / volProxy;

      return {
        ...pool,
        volProxy: volProxy,
        riskAdjustedMetric: riskAdjustedMetric,
      };
    })
    .sort((a, b) => b.riskAdjustedMetric - a.riskAdjustedMetric);
}
