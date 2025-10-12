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
 * Type guard to check if a string is valid (non-empty and trimmed)
 */
function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if a number is valid (not NaN, not Infinity, finite)
 */
function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Normalizes pool data to a consistent format with strict type checking
 */
export function normalizePools(pools: DefiLlamaPool[]): NormalizedPool[] {
  if (!Array.isArray(pools)) {
    return [];
  }

  return pools
    .map((pool) => {
      // Type guard: Skip pools with missing or invalid critical string data
      if (!isValidString(pool.chain) || 
          !isValidString(pool.project) || 
          !isValidString(pool.symbol)) {
        return null;
      }

      // Calculate APY: use apy if available, otherwise sum apyBase + apyReward
      let apy = pool.apy ?? 0;
      if (apy === 0 && pool.apyBase !== undefined) {
        apy = pool.apyBase + (pool.apyReward ?? 0);
      }

      // Type guard: Skip pools with invalid numeric data
      if (!isValidNumber(pool.tvlUsd) || 
          !isValidNumber(apy) || 
          pool.tvlUsd <= 0 || 
          apy < 0) {
        return null;
      }

      // Validate and sanitize apy7d
      const apy7d = isValidNumber(pool.apy7d) ? pool.apy7d : null;
      const apyBase = isValidNumber(pool.apyBase) ? pool.apyBase : null;

      // Build URL: use provided url or construct from pool data
      let url = '';
      if (isValidString(pool.url)) {
        url = pool.url;
      } else if (isValidString(pool.pool)) {
        url = `https://defillama.com/yields/pool/${pool.pool}`;
      }

      return {
        chain: pool.chain.trim(),
        project: pool.project.trim(),
        symbol: pool.symbol.trim(),
        apy: apy,
        apyBase: apyBase,
        apy7d: apy7d,
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
 * 
 * @param pools - Normalized pool data
 * @param riskFreeRate - Risk-free rate as percentage (e.g., 4.5 for 4.5%)
 * @param minTVL - Minimum TVL in USD to include in ranking
 * @returns Ranked pools sorted by risk-adjusted metric (descending)
 * 
 * @remarks
 * Alternative volProxy approaches when apy7d is missing:
 * - Current: Use fixed default (0.05)
 * - Future enhancement: Calculate rolling MAD (Median Absolute Deviation) 
 *   from pools with similar characteristics (same protocol/chain/asset type)
 * - Future enhancement: Use historical volatility from time-series data
 * 
 * Stability improvements for low volatility:
 * - MIN_VOL_PROXY increased to 0.01 for better stability
 * - Tiered approach: volProxy < 0.01 uses 0.01 to prevent extreme ratios
 */
export function rankPools(
  pools: NormalizedPool[],
  riskFreeRate: number = 0,
  minTVL: number = 0
): RankedPool[] {
  const DEFAULT_VOL_PROXY = 0.05;
  const MIN_VOL_PROXY = 0.01; // Increased from 0.001 for better stability

  // Pre-allocate array for better memory efficiency
  const filteredPools = pools.filter((pool) => pool.tvlUsd >= minTVL);
  const rankedPools: RankedPool[] = new Array(filteredPools.length);

  for (let i = 0; i < filteredPools.length; i++) {
    const pool = filteredPools[i];
    
    // Calculate volatility proxy with strict type checking
    let volProxy = DEFAULT_VOL_PROXY;
    
    if (pool.apy7d !== null && isValidNumber(pool.apy7d)) {
      const calculatedVol = Math.abs(pool.apy - pool.apy7d);
      // Use calculated volatility if it's reasonable and above minimum
      if (calculatedVol > MIN_VOL_PROXY) {
        volProxy = calculatedVol;
      } else if (calculatedVol > 0) {
        // For very small but positive volatility, use the minimum
        volProxy = MIN_VOL_PROXY;
      }
    }

    // Ensure minimum volatility for numerical stability
    volProxy = Math.max(volProxy, MIN_VOL_PROXY);

    // Calculate risk-adjusted metric (Sharpe-like ratio)
    const excessReturn = pool.apy - riskFreeRate;
    const riskAdjustedMetric = excessReturn / volProxy;

    rankedPools[i] = {
      ...pool,
      volProxy: volProxy,
      riskAdjustedMetric: isValidNumber(riskAdjustedMetric) ? riskAdjustedMetric : 0,
    };
  }

  // Use optimized sort with pre-computed keys
  return rankedPools.sort((a, b) => b.riskAdjustedMetric - a.riskAdjustedMetric);
}
