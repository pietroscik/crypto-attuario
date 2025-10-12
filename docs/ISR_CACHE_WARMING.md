# ISR Cache Warming with Vercel Cron

## Overview

This project uses Vercel Cron to automatically warm the ISR (Incremental Static Regeneration) cache for the `/api/attuario` endpoint, ensuring fast response times and up-to-date data.

## Configuration

### vercel.json

The `vercel.json` file configures a cron job that runs every 5 minutes:

```json
{
  "crons": [
    {
      "path": "/api/health?warm=true",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Schedule Options

You can adjust the schedule in `vercel.json` using standard cron syntax:

- `*/5 * * * *` - Every 5 minutes (recommended for high-traffic sites)
- `*/1 * * * *` - Every minute (for very high-traffic or critical data)
- `0 * * * *` - Every hour (for low-traffic sites)

## Health Check Endpoint

### GET /api/health

Basic health check without cache warming:

```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T14:30:00.000Z",
  "service": "crypto-attuario",
  "version": "1.0.0"
}
```

### GET /api/health?warm=true

Health check with ISR cache warming:

```bash
curl https://your-domain.com/api/health?warm=true
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T14:30:00.000Z",
  "service": "crypto-attuario",
  "version": "1.0.0",
  "cache_warmed": true,
  "cache_status": 200
}
```

## Benefits

1. **Reduced Latency**: Users always get cached responses, avoiding cold starts
2. **Fresh Data**: ISR cache is updated every 5 minutes with latest DeFi data
3. **Resilience**: Health check continues to return 200 even if cache warming fails
4. **Monitoring**: Cache status is included in health check response

## Monitoring

You can monitor the cache warming by:

1. **Vercel Dashboard**: Check Cron logs in your Vercel project
2. **Health Endpoint**: Call `/api/health?warm=true` manually to verify
3. **Application Logs**: Check console for "ISR warmup failed" messages

## Troubleshooting

### Cache warming fails

If `cache_warmed: false` appears in the health check response:

1. Check the `cache_error` field for details
2. Verify the `/api/attuario` endpoint is working correctly
3. Check Vercel function logs for timeout or network issues

### Cron not running

1. Ensure `vercel.json` is committed to your repository
2. Verify your Vercel project has Cron enabled (Pro plan required)
3. Check Vercel Dashboard → Cron tab for execution logs

## Cost Considerations

- Vercel Cron is available on Pro plans and above
- Each cron execution counts toward your serverless function invocations
- Running every 5 minutes = ~8,640 invocations/month
- Consider your plan limits and adjust schedule accordingly
