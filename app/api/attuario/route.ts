/**
 * API Route: /api/attuario
 * Returns risk-adjusted actuarial ranking of DeFi pools
 * 
 * Query parameters:
 * - rf: Risk-free rate (default: 0)
 * - minTVL: Minimum TVL in USD (default: 1000000)
 * - limit: Maximum number of results (default: 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPools, normalizePools, rankPools } from '@/lib/defillama';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const rf = parseFloat(searchParams.get('rf') || '0');
    const minTVL = parseFloat(searchParams.get('minTVL') || '1000000');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Validate parameters
    if (isNaN(rf) || rf < 0 || rf > 100) {
      return NextResponse.json(
        { error: 'Invalid rf parameter. Must be between 0 and 100.' },
        { status: 400 }
      );
    }

    if (isNaN(minTVL) || minTVL < 0) {
      return NextResponse.json(
        { error: 'Invalid minTVL parameter. Must be a positive number.' },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 500) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Must be between 1 and 500.' },
        { status: 400 }
      );
    }

    // Fetch and process data
    const pools = await getPools();
    
    if (!pools || pools.length === 0) {
      return NextResponse.json(
        { error: 'No pool data available from DefiLlama' },
        { status: 503 }
      );
    }

    const normalizedPools = normalizePools(pools);
    const rankedPools = rankPools(normalizedPools, rf, minTVL);
    
    // Limit results
    const limitedPools = rankedPools.slice(0, limit);

    // Return response with cache headers
    return NextResponse.json(
      {
        success: true,
        data: limitedPools,
        meta: {
          total: rankedPools.length,
          returned: limitedPools.length,
          params: {
            rf,
            minTVL,
            limit,
          },
        },
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/attuario:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch and process pool data',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
