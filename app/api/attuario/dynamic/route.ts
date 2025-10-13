export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getPools, normalizePools, rankPools } from '@/lib/defillama';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const rf = Math.max(0, Math.min(100, Number(sp.get('rf') ?? 0)));
  const minTVL = Math.max(0, Number(sp.get('minTVL') ?? 1_000_000));
  const limit = Math.max(1, Math.min(500, Number(sp.get('limit') ?? 50)));

  const pools = await getPools();
  if (!pools?.length) return NextResponse.json({ error: 'No pool data' }, { status: 503 });

  const ranked = rankPools(normalizePools(pools), rf, minTVL);
  const limited = ranked.slice(0, limit);

  return NextResponse.json(
    {
      success: true,
      data: limited,
      meta: {
        total: ranked.length,
        returned: limited.length,
        params: { rf, minTVL, limit },
      },
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=60' } }
  );
}
