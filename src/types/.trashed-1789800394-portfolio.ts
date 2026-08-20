export type AssetClass = "equity" | "bond" | "cash" | "alternative" | "crypto";

export interface PricePoint {
  date: string; // ISO date, e.g. "2026-08-01"
  close: number;
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  quantity: number;
  avgCost: number; // average cost basis per share
  currentPrice: number;
  currency: string;
  history: PricePoint[]; // trailing price history, most recent last
}

export interface Portfolio {
  id: string;
  name: string;
  baseCurrency: string;
  holdings: Holding[];
}

export interface HoldingMetrics {
  holding: Holding;
  marketValue: number;
  costBasis: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  weightPct: number; // weight within the portfolio
  dayChangePct: number;
}

export interface PortfolioMetrics {
  totalMarketValue: number;
  totalCostBasis: number;
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPct: number;
  dayChangePct: number;
  holdings: HoldingMetrics[];
  allocationByAssetClass: { assetClass: AssetClass; value: number; pct: number }[];
}
