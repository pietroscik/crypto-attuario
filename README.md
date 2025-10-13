This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

### 📊 Actuarial Ranking (DefiLlama Integration)

A live, risk-adjusted ranking of DeFi pools powered by [DefiLlama](https://defillama.com) data.

**Key features:**
- Real-time APY and TVL data from thousands of DeFi pools
- Risk-adjusted index calculation: `(APY - rf) / Volatility Proxy`
- Volatility proxy calculated as `|APY - APY_7d|` with fallback to 0.05
- Sortable table by Protocol, Chain, APY, TVL, Volatility, and Risk-Adjusted Index
- Auto-refresh every 60 seconds via SWR
- Configurable parameters (risk-free rate, minimum TVL, result limit)

**Access:** Visit `/attuario` to view the ranking dashboard.

**API Endpoint:** `GET /api/attuario?rf=4.5&minTVL=1000000&limit=50`

Query parameters:
- `rf`: Risk-free rate percentage (default: 0)
- `minTVL`: Minimum TVL in USD (default: 1000000)
- `limit`: Maximum results (default: 50, max: 500)

**Resilience Features:**
- Request timeout: 10 seconds (prevents hanging requests)
- ISR caching: 60 second revalidation
- Health check endpoint: `/api/health`
- Automatic cache warming via Vercel Cron (every 5 minutes)

See [ISR Cache Warming Documentation](./docs/ISR_CACHE_WARMING.md) for details.

### 🛠️ Utilities Hub

Advanced quantitative tools for portfolio analysis, optimization, and arbitrage scanning.

**Access:** Visit `/utilities` to explore the tools.

#### Portfolio Analytics (`/utilities/portfolio`)

Comprehensive portfolio analytics with multiple optimization strategies:

**Features:**
- **3 Optimization Strategies:** Equal Weight, Risk Parity, Max Sharpe Ratio
- **Risk Metrics:** Sharpe, Sortino, Calmar, Volatility, Max Drawdown, VaR, Expected Shortfall
- **Backtesting:** Walk-forward backtesting with monthly rebalancing
- **Asset Selection:** Choose 2-10 crypto assets from popular options
- **Customizable Horizon:** Analyze portfolios over 30-365 days
- **Export-ready:** All weights and metrics calculated client-side

**Technical Details:**
- Pure JavaScript implementations (no heavy dependencies)
- Grid/random search optimization on simplex for max Sharpe
- Iterative coordinate descent for Risk Parity
- Returns calculations: arithmetic and log returns
- Covariance matrix estimation from historical data
- Annualization: 252 trading periods per year

#### Arbitrage Scanner (`/utilities/arbitrage`)

**⚠️ EDUCATIONAL PURPOSES ONLY - Simulated paper trading**

Scans for arbitrage opportunities between simulated exchange venues.

**Features:**
- Multi-venue price differential scanning
- Configurable fee models (conservative vs optimistic)
- Net spread calculation after fees and withdrawal costs
- Estimated P&L for simulated trades
- Real-time price data from CoinGecko API
- Customizable minimum spread threshold

**Disclaimer:** This tool is completely simulated and does NOT execute any real trades. It is provided solely for educational purposes to demonstrate arbitrage concepts. Not financial advice.

**Data Sources:**
- Price data: CoinGecko Public API
- Simulated venues: Binance, Coinbase, Kraken, Bybit (with random variations for demonstration)

**Fee Models:**
- Conservative: 0.4% taker, 0.1% withdrawal
- Optimistic: 0.2% taker, 0.05% withdrawal

### 🏥 Health & Monitoring

**Health Check Endpoint:** `GET /api/health`

Basic health check:
```bash
curl https://your-domain.com/api/health
```

Health check with cache warming:
```bash
curl https://your-domain.com/api/health?warm=true
```

This endpoint is used by Vercel Cron to keep the ISR cache warm and ensure fast response times.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_DEFI_LLAMA_API_URL`: DefiLlama API endpoint (default: https://yields.llama.fi)

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

- `/pages` - Pages Router pages (legacy, most UI pages)
- `/app` - App Router (API routes)
- `/src/lib` - Business logic and data fetching
- `/src/types` - TypeScript type definitions
- `/tests` - Test files
- `/components` - Reusable React components
- `/data` - Static data files

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
