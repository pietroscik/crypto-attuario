// Type definitions for DefiLlama API responses

export interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy?: number;
  apyBase?: number;
  apyReward?: number;
  apy7d?: number;
  apyPct1D?: number;
  apyPct7D?: number;
  apyPct30D?: number;
  stablecoin?: boolean;
  ilRisk?: string;
  exposure?: string;
  predictions?: {
    predictedClass?: string;
    predictedProbability?: number;
    binnedConfidence?: number;
  };
  poolMeta?: string;
  mu?: number;
  sigma?: number;
  count?: number;
  outlier?: boolean;
  underlyingTokens?: string[];
  il7d?: number;
  apyBase7d?: number;
  apyMean30d?: number;
  volumeUsd1d?: number;
  volumeUsd7d?: number;
  apyBaseInception?: number;
  pool?: string;
  url?: string;
}

export interface NormalizedPool {
  chain: string;
  project: string;
  symbol: string;
  apy: number;
  apyBase: number | null;
  apy7d: number | null;
  tvlUsd: number;
  url: string;
}

export interface RankedPool extends NormalizedPool {
  volProxy: number;
  riskAdjustedMetric: number;
}

export interface DefiLlamaProtocol {
  id: string;
  name: string;
  address: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  forkedFrom: string[];
  oracles: string[];
  listedAt: number;
  slug: string;
  tvl: number;
  chainTvls: Record<string, number>;
  change_1h: number | null;
  change_1d: number | null;
  change_7d: number | null;
  fdv: number | null;
  mcap: number | null;
}

export interface DefiLlamaProtocolsResponse {
  protocols: DefiLlamaProtocol[];
}

export interface DefiLlamaPoolsResponse {
  status: string;
  data: DefiLlamaPool[];
}
