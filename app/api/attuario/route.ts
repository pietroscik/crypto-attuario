export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24; // 24h

import { getPools, normalizePools, rankPools } from '@/lib/defillama';

export async function GET() {
  const pools = await getPools();
  if (!pools?.length) return Response.json({ error: 'No pool data' }, { status: 503 });

  const DEFAULTS = { rf: 0, minTVL: 1_000_000, limit: 50 } as const;
  const ranked = rankPools(normalizePools(pools), DEFAULTS.rf, DEFAULTS.minTVL);
  const limited = ranked.slice(0, DEFAULTS.limit);

  return Response.json(
    {
      success: true,
      data: limited,
      meta: {
        total: ranked.length,
        returned: limited.length,
        params: DEFAULTS,
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    }
  );
}
