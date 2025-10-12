/**
 * API Route: /api/health
 * Health check endpoint for monitoring and ISR pre-warming
 * 
 * Can be called by Vercel Cron to keep the /api/attuario endpoint warm
 * and ensure ISR cache is regularly updated
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = request.nextUrl.origin;
    
    // Check if we should warm the ISR cache
    const warmCache = request.nextUrl.searchParams.get('warm') === 'true';
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'crypto-attuario',
      version: '1.0.0',
    };

    if (warmCache) {
      // Trigger ISR cache warming by calling the attuario endpoint
      try {
        const warmupResponse = await fetch(`${baseUrl}/api/attuario?rf=4.5&minTVL=1000000&limit=50`, {
          headers: {
            'User-Agent': 'crypto-attuario-health-check',
          },
          signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (warmupResponse.ok) {
          return NextResponse.json({
            ...health,
            cache_warmed: true,
            cache_status: warmupResponse.status,
          });
        } else {
          return NextResponse.json({
            ...health,
            cache_warmed: false,
            cache_error: `HTTP ${warmupResponse.status}`,
          }, { status: 200 }); // Still return 200 for health check
        }
      } catch (warmupError) {
        console.error('ISR warmup failed:', warmupError);
        return NextResponse.json({
          ...health,
          cache_warmed: false,
          cache_error: warmupError instanceof Error ? warmupError.message : 'Unknown error',
        }, { status: 200 }); // Still return 200 for health check
      }
    }

    return NextResponse.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
